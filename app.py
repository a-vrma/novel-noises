from flask import Flask, render_template
from flask_htmlmin import HTMLMIN

app = Flask(__name__)
# app.config.from_pyfile('config.py')
HTMLMIN(app)

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html', title='Index')

@app.route('/about')
def about():
    return render_template('about.html', title='About')


if __name__ == '__main__':
    app.run()