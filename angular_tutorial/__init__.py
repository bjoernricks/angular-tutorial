# -*- coding: utf-8 -*-

import logging

from flask import Flask

app = Flask(__name__)
app.config.from_object('angular_tutorial.settings')
app.config.from_pyfile('angular_tutorial.ini', silent=True)

if app.config["DEBUG"]:
    logging.basicConfig(level=logging.DEBUG)

from angular_tutorial.views import StaticView, IndexView

app.add_url_rule(
    "/", view_func=IndexView.as_view("index"),
)
app.add_url_rule(
    "/<path:filename>", view_func=StaticView.as_view("file"),
)
