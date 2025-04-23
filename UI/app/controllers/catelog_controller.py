import os
import json
import subprocess
from configure import *
from flask import Response,jsonify
from app.utils import autoDocumenter_UI
import threading
import time
import re


pid_file = os.path.join(os.path.dirname(__file__), "..", "flask_app.pid")
config_file_path = 'C:\\Project\\UI\\config.json'
def load_config(config_path):
    """ Load the configuration file and return as a dictionary. """
    with open(config_path, 'r') as file:
        config = json.load(file)
    return config

def get_catalog_steps():
    """Loads catalog data from pySteps.json"""
    data_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'static/data/pySteps.json')

    with open(data_file_path, "r", encoding="utf-8") as json_file:
        content = json_file.read().strip()
        if not content:
            print("⚠️ JSON file is empty!")
            return {}
        try:
            data = json.loads(content)
        except json.JSONDecodeError as e:
            print(f"❌ JSON decode error: {e}")
            return {}

    # data= steps_configure()
    return data

def get_catalog_features():
    # """Loads catalog data from feature_files.json"""
    # data_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'static/data/feature_files.json')

    # with open(data_file_path) as json_file:
    #     data = json.load(json_file)
    data= feature_configure()
    return data

def read_config():
    with open(config_file_path) as json_file:
        data = json.load(json_file)
    print(f'data from config:{data}')
    return data

def write_config(data):
    with open(config_file_path, 'w') as json_file:
        json.dump(data, json_file, indent=2)

def regenerate_step_files():
    config = load_config(config_file_path)
    # Get the directory path from the config
    input_dir = config.get('steps_path')
    output_dir=config.get('steps_json_path')
    autoDocumenter_UI.generateStepsCatalogueFromDirectory(input_dir,output_dir)

def get_reports():
    config = load_config(config_file_path)
    path = config.get('reports_path')

    if not path or not os.path.exists(path):
        return []

    folders = [
        f for f in os.listdir(path)
        if os.path.isdir(os.path.join(path, f))
    ]
    folders.sort(
        key=lambda f: os.path.getmtime(os.path.join(path, f)),
        reverse=True
    )

    folder_data = []
    for folder in folders:
        folder_path = os.path.join(path, folder)
        contents = []
        for item in os.listdir(folder_path):
            abs_path = os.path.abspath(os.path.join(folder_path, item))
            contents.append({
                "name": item,
                "type": "folder" if os.path.isdir(abs_path) else "file",
                "absolute_path": abs_path
            })

        folder_data.append({
            "folder_name": folder,
            "absolute_path": os.path.abspath(folder_path),
            "contents": contents
        })

    # print("Folder Data:")
    # for folder in folder_data:
    #     print(f"Folder: {folder['folder_name']}")
    #     for content in folder['contents']:
    #         print(f"  - {content['name']} ({content['type']})")

    return folder_data

def get_report_data(filename):
    filename=filename
    all_data = get_reports()  # or load it however it's stored in your app

    for folder in all_data:
        for item in folder["contents"]:
            if item["name"] == filename:
                abs_path = item["absolute_path"]
                if os.path.exists(abs_path):
                    # Return JSON or text based on file type
                    if filename.endswith(".json") or filename.endswith(".meta"):
                        with open(abs_path, "r", encoding="utf-8") as f:
                            return jsonify(json.load(f))
                    else:
                        with open(abs_path, "r", encoding="utf-8") as f:
                            return f.read()
    return jsonify({"error": "File not found"}), 404

# def get_reports():
#     config = load_config(config_file_path)
#     path = config.get('reports_path')

#     if not path or not os.path.exists(path):
#         return []
#     folders = [
#         f for f in os.listdir(path)
#         if os.path.isdir(os.path.join(path, f))
#     ]
#     folders.sort(
#         key=lambda f: os.path.getmtime(os.path.join(path, f)),
#         reverse=True
#     )
#     # print(f'folders:{folders}')
#     return folders

# def get_report(folder_name):
#     folder_name=folder_name
#     config = load_config(config_file_path)
#     reports_path = config.get('reports_path')
#     folder_path = os.path.join(reports_path, folder_name)

#     if not os.path.isdir(folder_path):
#         return jsonify({"status": "error", "message": "Folder not found"})

#     bat_exists = any(f.endswith(".bat") for f in os.listdir(folder_path))
#     report_file_path = os.path.join(folder_path, "report.html")

#     report_html = ""
#     if os.path.exists(report_file_path):
#         with open(report_file_path, "r", encoding="utf-8") as file:
#             report_html = file.read()

#     message = "BAT file found" if bat_exists else "No report found"

#     return jsonify({
#         "status": "success",
#         "message": message,
#         "report": report_html  # raw HTML of the report
#     })


def get_report():
    config = load_config(config_file_path)  # Assuming this loads your config
    reports_path = config.get('reports_path')  # Path to the reports directory

    # Check if the reports_path is valid
    if not reports_path or not os.path.exists(reports_path):
        return []

    # Get all directories in the reports path (folder names)
    folders = [
        folder for folder in os.listdir(reports_path)
        if os.path.isdir(os.path.join(reports_path, folder))
    ]

    # Sort folders in descending order by modification time (optional)
    folders.sort(key=lambda folder: os.path.getmtime(os.path.join(reports_path, folder)), reverse=True)

    return folders


def get_batch_files():
    return get_batch()

def run(file_names):
    """ Calls create_folder() with feature files. """
    return create_folder(file_names)

# def execute_logs():
#     return execute()


def get_execution_logs():
    """Runs the batch file and streams initial/final messages, then prints all logs at once."""
    config = load_config(config_file_path)
    dir = config.get("venv_path")
    venv_path = os.path.join(dir, ".venv", "Scripts", "activate")
    src_dir = os.path.join(dir, "src")
    script_path = os.path.join(src_dir, "batch", "from_UI", "scripts.bat")

    command1 = f'cmd /c "cd /d {dir} && call {venv_path} && cd src && call {script_path}"'
    command2 = f'start cmd /k "cd /d {dir} && call {venv_path} && cd src && call {script_path}"'

    try:
        subprocess.Popen(command2, shell=True)
        # Run and wait for completion
        process = subprocess.Popen(
            command1,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            shell=True,
            text=True
        )
        stdout, _ = process.communicate()

        return jsonify({
            "status": "completed",
            "logs": stdout
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "logs": str(e)
        }), 500

 
def run_bat(batch_files,file_name):
    return execute_bat(batch_files,file_name)

def save_bat(file_name,files,key_values):
    return save_to_batch(file_name,files,key_values)

def save_feature(feature_file_name,scenarios):
    return save_feature_file(feature_file_name,scenarios)

def git():
    config = load_config(config_file_path)
    path = config.get('UI_path')
    # log_path = config.get('log_path')

    try:
        result = subprocess.run(["git", "pull"], capture_output=True, text=True, cwd=path)

        output = result.stdout
        error = result.stderr

        # Optional: write logs to file
        # if log_path:
        #     with open(log_path, 'a', encoding='utf-8') as log_file:
        #         log_file.write("=== Git Pull Output ===\n" + output + "\n")
        #         if error:
        #             log_file.write("=== Git Pull Errors ===\n" + error + "\n")

        return jsonify({"output": output, "error": error})
    except Exception as e:
        return jsonify({"error": str(e), "output": ""}), 500

def gitStatus():
    config = load_config(config_file_path)
    path = config.get('UI_path')
    # log_path = config.get('log_path')
    try:
        result = subprocess.run(
            ['git', '-C', path, 'status'],
            capture_output=True, text=True
        )
        return jsonify({
            'output': result.stdout,
            'error': result.stderr
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
def gitCommit():
    config = load_config(config_file_path)
    path = config.get('root')
    commit_message = request.json.get('message', 'Update via web app')

    try:
        logs = ""

        # Step 1: git pull
        # pull = subprocess.run(['git','pull'], capture_output=True, text=True, cwd=path)
        # logs += "=== Git Pull ===\n" + pull.stdout + pull.stderr + "\n"

        # # Step 2: git add .
        # add = subprocess.run(['git','add', '.'], capture_output=True, text=True, cwd=path)
        # logs += "=== Git Add ===\n" + add.stdout + add.stderr + "\n"

        # Step 3: git commit
        commit = subprocess.run(['git','commit', '-m', commit_message], capture_output=True, text=True, cwd=path)
        logs += "=== Git Commit ===\n" + commit.stdout + commit.stderr + "\n"

        # Step 4: git push
        push = subprocess.run(['git','push'], capture_output=True, text=True, cwd=path)
        logs += "=== Git Push ===\n" + push.stdout + push.stderr + "\n"

        return jsonify({
            'output': logs,
            'error': ''
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_changes():
    config = load_config(config_file_path)
    path = config.get('root')
    try:
        result = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True, cwd=path)
        changed_files = [line[3:] for line in result.stdout.splitlines() if line]
        return jsonify({'files': changed_files})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def git_add(files):
    config = load_config(config_file_path)
    path = config.get('root')
    files=files
    logs = ""
    try:
        # Step 1: git pull
        pull = subprocess.run(['git', 'pull'], capture_output=True, text=True, cwd=path)
        logs += "=== Git Pull ===\n" + pull.stdout + pull.stderr + "\n"

        # Step 2: git add
        add = subprocess.run(['git', 'add'] + files, capture_output=True, text=True, cwd=path)
        logs += "=== Git Add ===\n" + add.stdout + add.stderr + "\n"

        return jsonify({
            'output': logs,
            'error': ''
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

def get_git_path():
    try:
        config = load_config(config_file_path)  
        git_path = config.get('root', '')  
        return jsonify({"path": git_path})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def restart():
    """Triggers the batch file to stop and restart Flask & WebView."""
    config = load_config(config_file_path)
    app_path = config.get('boot_file')

    try:
        run_app_path = os.path.join(app_path, "run_app.bat")
        print(f"Checking if {run_app_path} exists...")

        if not os.path.exists(run_app_path):
            print(f"Error: Batch file not found at {run_app_path}")
            return jsonify({"error": f"Batch file not found at {run_app_path}"}), 500

        # ✅ Return response first
        response = jsonify({
            "message": "Restarting app...",
            "countdown": 5
        })

        # ✅ Trigger restart after sending response
        threading.Thread(target=lambda: subprocess.Popen(
            ["cmd.exe", "/c", "start", run_app_path, "restart"],
            cwd=app_path
        )).start()

        return response

    except Exception as e:
        print(f"Error in restart: {e}")
        return jsonify({"error": str(e)}), 500


def get_file_path(structure, file_name):
    config = load_config(config_file_path)
    features_root = config.get("features_path")
    project_root = os.path.dirname(features_root)

    for section, files in structure.items():
        for item in files:
            if item.get("file_name") == file_name:
                rel_path = item.get("path")
                full_path = os.path.abspath(os.path.join(project_root, rel_path))
                print(f'fullpath: {full_path}')
                return full_path
    return None




