# -*- coding: utf-8 -*-
if __name__ == "__main__":
    from angular_tutorial import app

    server_name = app.config['SERVER_NAME']
    if server_name and ':' in server_name:
        host, port = server_name.rsplit(':', 1)
        port = int(port)
    else:
        port = 5000
        host = "127.0.0.1"

    app.run(host=host, port=port)
