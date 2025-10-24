from flask import Flask, render_template, Response
import cv2
import urllib.request
import numpy as np
import time
from flask_cors import CORS 

# -------------------------- CONFIGURAÇÃO --------------------------

# Substitua aqui pelo IP que sua ESP32-CAM obteve
URL_IMAGEM_ESP32 = 'http://IP_DA_SUA_ESP32/cam-hi.jpg' 

# -------------------------- INICIALIZAÇÃO -------------------------

app = Flask(__name__, template_folder='../site', static_folder='../site')
# Habilita CORS para permitir que o site (Firebase) acesse esta API
CORS(app) 

latest_frame = None

# Função para buscar e processar (simplificado) o frame
def fetch_latest_frame():
    global latest_frame
    try:
        # 1. Puxa o JPEG da ESP32
        imgResponse = urllib.request.urlopen(URL_IMAGEM_ESP32)
        imgNp = np.array(bytearray(imgResponse.read()), dtype=np.uint8)
        
        # 2. Decodifica o JPEG em um frame OpenCV
        frame = cv2.imdecode(imgNp, -1) 
        
        # Sem lógica de DNN/Recomendação nesta versão simplificada
        
        latest_frame = frame
        return True
    
    except Exception as e:
        # Imprime o erro de conexão se a ESP32 não estiver no ar
        print(f"Erro ao buscar frame da ESP32: {e}")
        latest_frame = None
        return False

# --------------------------- ROTAS FLASK ---------------------------

@app.route('/totem-resultado')
def totem_resultado():
    """Renderiza a página HTML (do seu site)."""
    # O Flask procura 'totem-resultado.html' dentro da pasta '../site'
    return render_template('totem-resultado.html')


@app.route('/video_feed')
def video_feed():
    """Servidor de stream de vídeo M-JPEG."""
    def generate_frames():
        while True:
            # Puxa o frame mais recente
            fetch_latest_frame() 
            
            if latest_frame is not None:
                # Codifica o frame para JPEG
                ret, buffer = cv2.imencode('.jpg', latest_frame)
                frame_bytes = buffer.tobytes()
                
                # Envia o frame no formato M-JPEG
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            
            time.sleep(0.05) # ~20 FPS
    
    # Retorna a Resposta como um stream M-JPEG
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


# -------------------------- INICIALIZAÇÃO --------------------------

if __name__ == '__main__':
    print("Iniciando Servidor Flask na porta 5000...")
    # O host 0.0.0.0 permite que o ngrok acesse esta porta
    app.run(host='0.0.0.0', port=5000, debug=False)