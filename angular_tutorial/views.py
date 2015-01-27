# -*- coding: utf-8 -*-
import os

from flask import render_template, send_from_directory
from flask.views import MethodView

c_dir = os.path.dirname(__file__)


class TemplateView(MethodView):

    template_name = ""

    def __init__(self, template_name=None):
        if template_name:
            self.template_name = template_name

    def get_template_name(self):
        return self.template_name

    def get(self):
        return render_template(self.get_template_name())


class IndexView(MethodView):

    def get(self):
        return send_from_directory(os.path.join(c_dir, "static", "html"),
                                   "index.html")


class StaticView(MethodView):

    def get(self, filename):
        return send_from_directory(os.path.join(c_dir, "static"), filename)
