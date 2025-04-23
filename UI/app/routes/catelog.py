from flask import Blueprint, render_template, request,jsonify,render_template_string
from app.controllers.catelog_controller import *
import traceback
import logging
catelog_bp = Blueprint('catelog', __name__)

@catelog_bp.route("/")
def home():
    """Route handler for catalog homepage."""
    data = get_catalog_steps()  
    return render_template('pages/create.html', data=data)

@catelog_bp.route("/features")
def feature():
    data = get_catalog_features()
    batch=get_batch_files()
    print(f"Batch files:", batch)
    return render_template('pages/execute.html',data=data,batch=batch)

@catelog_bp.route("/settings")
def settings():
    return render_template('pages/settings.html')

@catelog_bp.route("/reports")
def reports():
    data=get_report()
    return render_template('pages/reports.html',data=data)

# @catelog_bp.route("/get-file", methods=["POST"])
# def get_file():
#     filename = request.json.get("filename")
#     return get_report_data(filename)

# @catelog_bp.route("/get-folder-contents", methods=["POST"])
# def get_folder_contents():
#     folder_name = request.json.get("folder")
#     folder_data = get_report_data(folder_name)  # This will fetch the data based on the folder name

#     if folder_data:
#         return jsonify({
#             "status": "success",
#             "data": folder_data  # Return the folder contents
#         })
#     return jsonify({"status": "error", "message": "Folder not found"}), 404

@catelog_bp.route("/display_report", methods=["POST"])
def refresh_report():
    folder_name = request.json.get("folder_name")
    folder_data = get_report_data(folder_name)
    rendered_html = render_template_string(
        "{% from 'components/report_macros.html' import view_report %} {{ view_report(data) }}",
        data=folder_data
    )
    return jsonify({"html": rendered_html})

@catelog_bp.route('/get-file-content', methods=['POST'])
def get_file_content():
    data = request.get_json()
    file_path = data.get('path')

    if not file_path or not os.path.isfile(file_path):
        return jsonify({'error': 'Invalid file path'}), 400

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        print(f"content:{content}")   
        return content  # or jsonify({'content': content}) if you want JSON
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# @catelog_bp.route("/get-report", methods=["POST"])
# def check_bat():
#     folder_name = request.json.get("folder")
#     return get_report(folder_name)

# @catelog_bp.route("/report/<folder_name>")
# def view_report_html(folder_name):
#     content=get_html(folder_name)
#     return render_template_string(content)

@catelog_bp.route('/api/config', methods=['GET'])
def get_config():
    data= read_config()
    return jsonify(data)

@catelog_bp.route('/api/config', methods=['POST'])
def update_config():
    new_data = request.json
    write_config(new_data)
    return jsonify({"message": "Config updated successfully!"})


@catelog_bp.route("/refresh_steps", methods=["GET"])
def refresh_steps():
    steps_data = get_catalog_steps()
    rendered_html = render_template_string(
        "{% from 'components/create_macro.html' import steps %} {{ steps(data) }}",
        data=steps_data
    )
    return jsonify({"html": rendered_html})


@catelog_bp.route('/regenerate_steps', methods=['POST'])
def regenerate_steps():
    try:
        print(" Regenerating steps...")
        regenerate_step_files()
        data = get_catalog_steps()
        rendered_html = render_template_string(
            "{% from 'components/create_macro.html' import steps %} {{ steps(data) }}",
            data=data
        )
        print("Rendered HTML successfully!")
        return jsonify({"success": True, "message": "Steps regenerated", "html": rendered_html})
        
    except Exception as e:
        logging.error("Exception in /regenerate_steps: %s", e)
        traceback.print_exc()  # This will go to console or log
        return jsonify({"success": False, "message": str(e)}), 500
    
    
@catelog_bp.route("/refresh_features", methods=["GET"])
def refresh_features():
    features_data = get_catalog_features()  # Fetch latest feature data
    batch=get_batch_files()
    rendered_html = render_template_string(
        "{% from 'components/execute_macros.html' import feature_files %} {{ feature_files(data,batch) }}",
        data=features_data,batch=batch
    )
    return jsonify({"html": rendered_html})  # Send updated HTML

@catelog_bp.route("/refresh_batches", methods=["GET"])
def refresh_batches():
    batch_data = get_batch_files()  # Fetch latest batch file data
    features_data = get_catalog_features()
    rendered_html = render_template_string(
        "{% from 'components/execute_macros.html' import feature_files %} {{ feature_files(data,batch) }}",
        data=features_data,batch=batch_data
    )
    return jsonify({"html": rendered_html})  # Send updated HTML
   

@catelog_bp.route('/run_feature_files', methods=['POST'])
def run_feature_files():
    data = request.get_json()
    file_names = data.get("files", [])

    response = run(file_names)  

    return jsonify(response)
    
@catelog_bp.route('/get_logs', methods=['GET'])
def get_logs():
    return get_execution_logs()

# @catelog_bp.route('/stream_logs', methods=['GET'])
# def stream_logs():
#     return execute_logs()


@catelog_bp.route("/get_bat_content", methods=["POST"])
def get_bat_content():
    data = request.json
    file_name = data.get("file_name")
    batch_files = get_batch_files()
    return run_bat(batch_files, file_name)


# @catelog_bp.route("/run_bat", methods=["POST"])
# def run_bat_file():
#     data = request.json
#     file_name = data.get("file_name")
#     return run_batch(file_name)

@catelog_bp.route("/save_bat", methods=["POST"])
def save_bat_file():
    data = request.json
    file_name = data.get("file_name", "").strip()
    files = data.get("files", [])
    key_values = data.get("key_values", {})
    print(f"{key_values}")
    return save_bat(file_name,files,key_values)

@catelog_bp.route("/save-feature-file", methods=["POST"])
def save_feature_file():
    data = request.json
    feature_file_name = data.get("feature_file")
    print(f"filename:{feature_file_name}")
    scenarios = data.get("scenarios", {})
    if not feature_file_name:
        return jsonify({"message": "Feature file name is required"}), 400
    
    return save_feature(feature_file_name,scenarios)

@catelog_bp.route('/api/get-git-path', methods=['GET'])
def get_path():
   return get_git_path()

@catelog_bp.route('/api/git-pull', methods=['POST'])
def git_pull():
    return git()

@catelog_bp.route('/api/git-status', methods=['POST'])
def git_status():
    return gitStatus()

@catelog_bp.route('/api/git-commit', methods=['POST'])
def git_commit():
    return gitCommit()

@catelog_bp.route('/api/git-changes')
def git_changes():
    return get_changes()

@catelog_bp.route('/api/git-add' ,methods=['POST'])
def git_add_files():
    data = request.get_json()
    files = data.get('files', [])
    return git_add(files)

@catelog_bp.route('/restart', methods=['POST'])
def restart_app():
    """API endpoint to restart Flask and WebView."""
    return restart()


@catelog_bp.route("/api/get-feature-content", methods=["POST"])
def get_feature_content():
    data = request.get_json()  # ✅ This correctly parses JSON from request
    file_name = data.get("file_name")

    feature_structure = get_catalog_features()
    path = get_file_path(feature_structure, file_name)
    print("Looking for file:", file_name)
    # print("Catalog:", feature_structure)

    if not path or not os.path.exists(path):
        return jsonify({"error": "File not found."}), 404

    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        return jsonify({"content": content})  # ✅ Always return JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@catelog_bp.route("/api/get-step-content", methods=["POST"])
def get_step_content():
    data = request.get_json()  # ✅ This correctly parses JSON from request
    file_name = data.get("file_name")

    feature_structure = get_catalog_features()
    path = get_file_path(feature_structure, file_name)
    print("Looking for file:", file_name)
    print("Catalog:", feature_structure)

    if not path or not os.path.exists(path):
        return jsonify({"error": "File not found."}), 404

    try:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        return jsonify({"content": content})  # ✅ Always return JSON
    except Exception as e:
        return jsonify({"error": str(e)}), 500