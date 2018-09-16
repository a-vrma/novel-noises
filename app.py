from datetime import datetime
from flask import Flask, render_template
from flask_htmlmin import HTMLMIN
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
# app.config.from_pyfile('config.py')
HTMLMIN(app)
db = SQLAlchemy(app)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    isbn = db.Column(db.Integer(13), nullable=False, unique=True)
    title = db.Column(db.String(250), nullable=False)
    author = db.Column(db.String(200), nullable=False)
    reccs = db.relationship('Recommendation', backref='book', lazy=True)

    def __repr__(self):
        return f"Book({self.isbn}, '{self.title}', '{self.author}')"


class Recommendation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    content = db.Column(db.Text, nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)

    def __repr__(self):
        return f"Post('{self.book_id}', '{self.date_posted}', '{self.content}')"


# error handling
@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_404.html'), 404

@app.errorhandler(413)
def payload_too_large(error):
    return render_template('page_413.html'), 413

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', title='Index')

@app.route('/about')
def about():
    return render_template('about.html', title='About')

@app.route('/browse')
def browse():
    return render_template('browse.html')

if __name__ == '__main__':
    app.run()