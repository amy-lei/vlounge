from flask import Flask
from flask_socketio import SocketIO, send

app = Flask(__name__)

app.config['SECRET_KEY'] = 'mysecret'

socketIo = SocketIO(app, cors_allowed_origins="*")

app.debug = True
app.host = 'localhost'


@socketIo.on("test")
def test(msg):
    print(msg)
    return None

if __name__ == '__main__':
    socketIo.run(app)
