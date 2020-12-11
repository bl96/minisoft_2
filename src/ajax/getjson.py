import json
from flask import Flask

app = Flask(__name__)


@app.route("/getjson/")
def output():
    with open('./gamestate.json') as f:
        return json.load(f)


if __name__ == '__main__':
    app.run(port=4996)
