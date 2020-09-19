from flask import Flask, request
from flask_socketio import SocketIO, emit
from user import User

app = Flask(__name__)

app.config['SECRET_KEY'] = 'mysecret'

socketIo = SocketIO(app, cors_allowed_origins="*")

app.debug = True
app.host = 'localhost'

# characters = [char for char in string.ascii_lowercase + string.digits]

# database:

Alice = User("alice")

USERS = {}

@socketIo.on("justConnected")
def sendPeople(name):
    json_users = [ user.json_rep() for user in USERS.values()]
    emit("justConnected", json_users, broadcast=True)

@socketIo.on("newUser")
def addUser(name):
    new_user = User(name)
    USERS[name] = new_user
    emit("updateUser", new_user.json_rep(), broadcast=True)

@socketIo.on("ToggleFlag")
def toggleFlag(name):
    user = USERS[name]
    user.is_flagged = not user.is_flagged
    # print("---\n" + user.json_rep() + "\n---\n")
    emit("updateUser", user.json_rep(), broadcast=True)
                
if __name__ == '__main__':
    socketIo.run(app)
