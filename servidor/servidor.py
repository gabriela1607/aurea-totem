from flask import Flask, Response
import cv2
import urllib.request
import numpy as np
import time
from flask_cors import CORS 

# -------------------------- CONFIGURAÇÃO (APENAS CONEXÃO) --------------------------

# >>>>>> 1. VERIFIQUE SE ESTE IP ESTÁ ATUALIZADO <<<<<<
# É O ÚNICO PONTO DE FALHA
URL_IMAGEM_ESP32 = 'http://192.168.15.10/cam-hi.jpg' 

# -------------------------- INICIALIZAÇÃO -------------------------

app = Flask(__name__)
CORS(app) 

latest_frame = None

# Função SIMPLIFICADA para buscar o frame e convertê-lo para stream
def fetch_latest_frame():
    global latest_frame
    try:
        # 1. Puxa o JPEG da ESP32
        imgResponse = urllib.request.urlopen(URL_IMAGEM_ESP32)
        imgNp = np.array(bytearray(imgResponse.read()), dtype=np.uint8)
        
        # 2. Decodifica o JPEG em um frame OpenCV
        frame = cv2.imdecode(imgNp, -1) 
        
        # AQUI NÃO HÁ NENHUM CÓDIGO DE VISÃO COMPUTACIONAL
        
        latest_frame = frame
        return True
    
    except Exception as e:
        # Se falhar, imprime o erro
        print(f"ERRO DE CONEXÃO REPETIDO (VERIFIQUE O IP DA ESP32): {e}")
        latest_frame = None
        return False

# --------------------------- ROTAS FLASK ---------------------------

@app.route('/video_feed')
def video_feed():
    """Servidor de stream de vídeo M-JPEG."""
    def generate_frames():
        while True:
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


@app.route('/api/recomendacoes')
def recomendacoes():
    # Rota mantida apenas para evitar erro no JavaScript, mas retorna status simples
    return jsonify({'status': 'Modo de teste de câmera ativado.', 
                    'url1': '...', 'url2': '...', 'url3': '...', 'url4': '...'})
    

# -------------------------- INICIALIZAÇÃO --------------------------

if __name__ == '__main__':
    print("Iniciando Servidor Flask PURE STREAM na porta 5000...")
    # O host 0.0.0.0 permite que o site acesse esta porta
    app.run(host='0.0.0.0', port=5000, debug=False)cesse esta porta
    app.run(host='0.0.0.0', port=5000, debug=False)
