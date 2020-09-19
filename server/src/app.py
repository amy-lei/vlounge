pl
import random
from flask import Flask, request, g
from flask_socketio import SocketIO, emit
from user import User
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SECRET_KEY'] = 'mysecret'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///user.sqlite3'

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    is_flagged = db.Column(db.Boolean(), default=False)

    def set_is_flagged(self, new_state):
        self.is_flagged = new_state

    def __repr__(self):
        return '<User %r>' % self.name


socketIo = SocketIO(app, cors_allowed_origins="*")

app.debug = True
app.host = 'localhost'

# database:

USERS = {}

@socketIo.on("justConnected")
def sendPeople():
    json_users = [ user.json_rep() for user in USERS.values()]
    emit("justConnected", json_users, broadcast=True)
    print("sent justConnected")

@socketIo.on("newUser")
def addUser(name):
    # update official list of users
    new_user = User(name)
    USERS[name] = new_user
    # tell others to update thier list
    emit("updateUser", new_user.json_rep(), broadcast=True)
    # add user to database
    db.session.add(new_user)
    db.session.commit()
    print("sent updateUser")

@socketIo.on("toggleFlag")
def toggleFlag(name):
    user = USERS[name]
    # update flag status in database
    user_in_db = User.query.filter_by(name=name).first()
    if user_in_db:
        user_in_db.set_is_flagged(user.is_flagged)
        db.session.commit()
    else:
        raise Exception(f'From app.py:toggleFlag() No user named {user} ')
    # print("---\n" + user.json_rep() + "\n---\n")
    emit("updateUser", user.json_rep(), broadcast=True)
    print("sent updateUser")
                
if __name__ == '__main__':
    socketIo.run(app)
