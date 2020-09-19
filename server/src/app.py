from flask import Flask, request
from flask_socketio import SocketIO, send

app = Flask(__name__)

app.config['SECRET_KEY'] = 'mysecret'

socketIo = SocketIO(app, cors_allowed_origins="*")

app.debug = True
app.host = 'localhost'

characters = [char for char in string.ascii_lowercase + string.digits]

# database:

@socketIo.on("ToggleFlag")
def test(msg):
    print(msg + " has toggled thier flag")
    return None
                
if __name__ == '__main__':
    socketIo.run(app)
