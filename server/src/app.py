from flask import Flask
from flask_socketio import SocketIO, emit
from user import User

app = Flask(__name__)

app.config['SECRET_KEY'] = 'mysecret'

socketIo = SocketIO(app, cors_allowed_origins="*")

app.debug = True
app.host = 'localhost'

# database:

Alice = User("alice")
Bob = User("bob")
Carl = User("carl")

FAKE_USERS = {
    "alice" : Alice,
    "bob" : Bob,
    "carl" : Carl
}

@socketIo.on("ToggleFlag")
def toggleFlag(name):
    FAKE_USERS[name].is_flagged = not FAKE_USERS[name].is_flagged
    print(FAKE_USERS[name])
    emit("updateUser", "test", broadcast=True)
    return None

if __name__ == '__main__':
    socketIo.run(app)
