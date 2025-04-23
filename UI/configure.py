import os
import json
from flask import request
import subprocess
from flask import stream_with_context, Response,jsonify
import asyncio
import time


# Path to config.json
config_file_path = 'C:\\Project\\UI\\config.json'

def load_config(config_path):
    """ Load the configuration file and return as a dictionary. """
    with open(config_path, 'r') as file:
        config = json.load(file)
    return config


def get_feature_structure(path,file_type):
    """Creates a dictionary where directories containing .feature files are keys,
       and their corresponding .feature files are stored as dictionaries with relative paths and names."""
    
    feature_dict = {}

    base_folder = os.path.basename(os.path.normpath(path))  # Get the last folder in the provided path

    for root, dirs, files in os.walk(path):  
        feature_files = [
            { 
                "path": os.path.join(base_folder, os.path.relpath(os.path.join(root, f), path)),  # Relative file path
                "file_name": f  # File name only
            }
            for f in files if f.endswith(file_type)
        ]

        if feature_files:  # Only store directories that contain .feature files
            relative_path = os.path.relpath(root, path)  # Get relative folder path from the given path
            feature_dict[relative_path] = feature_files

    return feature_dict


def get_step_structure(path):
    """ Creates a dictionary where directories containing .feature files are keys,
        and their corresponding .feature files are values in a list. """
    
    step_dict = {} 

    for root, dirs, files in os.walk(path):  
        if files:  # Only store directories that contain files
            relative_path = os.path.relpath(root, path)  # Get relative path from root
            step_dict[relative_path] = files 

    return step_dict


# Load the config
def feature_configure():
    config = load_config(config_file_path)
    # Get the directory path from the config
    feature_path = config.get('features_path')
    file_type='.feature'
    feature_structure = get_feature_structure(feature_path,file_type)
    # print(feature_structure)
    return feature_structure


def steps_configure():
    config = load_config(config_file_path)
    steps_path = config.get('steps_path')
    steps_structure = get_step_structure(steps_path)
    # print(steps_structure)
    return steps_structure


def get_batch():
    config = load_config(config_file_path)
    batch_path=config.get('batch_path')
    file_type=".bat"
    batch_files=get_feature_structure(batch_path,file_type)
    return batch_files


def execute_bat(batch_files,file_name):
    # file_path = None
    for folder, files in batch_files.items():
        for file in files:
            if file["file_name"] == file_name:
                # file_path = file["path"]  # Extract relative file path
                break

    # if not file_path:
    #     return jsonify({"error": "File not found"}), 404
    
    config = load_config(config_file_path)
    batch_dir = config.get('batch_path')
    absolute_path = os.path.join(batch_dir, file_name)  # Resolve full path
    print(f"DEBUG: Looking for file: {absolute_path}")

    # Ensure the file exists
    if not os.path.exists(absolute_path):
        return jsonify({"error": "File not found"}), 404

    try:
        with open(absolute_path, "r") as f:
            content = f.read()  # Read the file
            print(f'content:{content}')
        return jsonify({"content": content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def save_to_batch(file_name, files, key_values):
    config = load_config(config_file_path)
    batch_dir = config.get('batch_path')
    feature_path = config.get("features_path")
    file_path = os.path.join(batch_dir, file_name)

    if not file_name:
        return jsonify({"error": "File name cannot be empty"}), 400

    if os.path.exists(file_path):
        return jsonify({"error": "File already exists. Please choose a different name."}), 400

    if not batch_dir or not feature_path:
        return {"error": "Folder or feature path not specified in config.json"}

    file_type = '.feature'
    
    # Get the feature structure
    feature_dict = get_feature_structure(feature_path, file_type)

    # Map file names to their paths
    file_path_map = {
        file_info["file_name"]: file_info["path"]
        for folder, files in feature_dict.items()
        for file_info in files
    }

    print(f'File path: {file_path}')
    
    try:
        with open(file_path, "w") as bat_file:
            for file in files:
                if file in file_path_map:
                    params = key_values.get(file, []) 
                    if params:
                        formatted_params = ", ".join([f'{pair["key"]}={pair["value"]}' for pair in params])
                        bat_file.write(f'behave .\\{file_path_map[file]} -D {formatted_params}\n')
                    else:
                        # No key-value pairs, just write the file path
                        bat_file.write(f'behave .\\{file_path_map[file]}\n')
                else:
                    print(f"Warning: {file} not found in feature_dict.")

        return jsonify({"message": f"Batch file '{file_name}' saved successfully!"})

    except Exception as e:
        return jsonify({"error": "Failed to save batch file", "details": str(e)}), 500



def create_subfolder_and_bat(file_names):
    """Creates a 'from_UI' subfolder and generates a .bat file with feature file paths."""

    config = load_config(config_file_path)
    base_path = config.get("batch_path")
    feature_path = config.get("features_path") 

    if not base_path or not feature_path:
        return {"error": "Folder or feature path not specified in config.json"}
    file_type='.feature'
    # Get the feature structure
    feature_dict = get_feature_structure(feature_path,file_type)

    # Map file names to their paths
    file_path_map = {
        file_info["file_name"]: file_info["path"]
        for folder, files in feature_dict.items()
        for file_info in files
    }

    new_folder_path = os.path.join(base_path, "from_UI")
    os.makedirs(new_folder_path, exist_ok=True) 

    # Create .bat file
    bat_file_path = os.path.join(new_folder_path, "scripts.bat")
    with open(bat_file_path, "w") as bat_file:
        for file in file_names:
            if file in file_path_map:
                
                bat_file.write(f'behave .\\{file_path_map[file]}\n') 
            else:
                print(f"Warning: {file} not found in feature_dict.")

    print(f".bat file created at: {bat_file_path}")  
    return {"message": "Batch file created", "bat_file": bat_file_path}
    


def create_folder(file_names=[]):
    """ Calls create_subfolder_and_bat() with the provided file names. """
    print(f"Files to be written in .bat:", file_names)
    return create_subfolder_and_bat(file_names)


# def execute():
#     config=load_config(config_file_path)
#     dir=config.get("venv_path")
#     venv_path=os.path.join(dir, ".venv", "Scripts", "activate")
#     src_dir = os.path.join(dir, "src")
#     script_path=os.path.join(src_dir, "batch", "from_UI", "scripts.bat")

#     command=f'start cmd /k "cd /d {dir} && call {venv_path} && cd src && call {script_path}"'
#     subprocess.Popen(command, shell=True)
#     print(f"Started process in a new terminal from: {dir}")



# def execute():
#     """Runs the batch file in a new terminal, saves logs, and allows UI to fetch them."""
#     config = load_config(config_file_path)
#     dir = config.get("venv_path")
#     venv_path = os.path.join(dir, ".venv", "Scripts", "activate")
#     src_dir = os.path.join(dir, "src")
#     script_path = os.path.join(src_dir, "batch", "from_UI", "scripts.bat")

#     command = f'cd /d {dir} && call {venv_path} && cd src && call {script_path}'

#     # Run without opening a new terminal, and stream logs directly
#     process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True, text=True)
#     print(f'process:{process}')
#     def stream_output():
#         """Stream the output of the command to the UI in real-time."""
#         for line in process.stdout:
#             yield line.strip() + "<br>"  # Stream each line with HTML break for UI
#         process.stdout.close()
#         process.wait()
#         yield f"Execution completed with return code: {process.returncode}<br>"

#     return Response(stream_with_context(stream_output()), mimetype='text/html')
    


# def execute():
#     """Execute the batch file and stream real-time logs to the UI."""
#     config = load_config(config_file_path)
#     dir = config.get("venv_path")
#     venv_path = os.path.join(dir, ".venv", "Scripts", "activate")
#     src_dir = os.path.join(dir, "src")
#     script_path = os.path.join(src_dir, "batch", "from_UI", "scripts.bat")

#     command = f'cd /d {dir} && call {venv_path} && cd src && call {script_path}'

#     process=subprocess.Popen(command,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
#     while True:
#         output=process.stdout.readline()
#         if output == b'' and process.poll() is None:
#             break
#         if output:
#             print("Output:", output.decode().strip())

#         remaining_output = process.stdout.read()
#         print("Remaining Output:", remaining_output.decode().strip())
        

# def execute():
#     """Execute the batch file and stream real-time logs to the UI."""
#     config = load_config(config_file_path)
#     dir = config.get("venv_path")
#     venv_path = os.path.join(dir, ".venv", "Scripts", "activate")
#     src_dir = os.path.join(dir, "src")
#     script_path = os.path.join(src_dir, "batch", "from_UI", "scripts.bat")

#     command = f'start cmd /k "cd /d {dir} && call {venv_path} && cd src && call {script_path}"'

#     # Start the subprocess to execute the command
#     process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True, text=True)
#     print(f'process:{process}')

#     def stream_output():
#         """Stream real-time output from the batch file."""
#         while True:
#             # Read each line from stdout
#             output = process.stdout.readline()
#             if output == '' and process.poll() is not None:
#                 # Stop reading if the process has finished
#                 break
#             if output:
#                 # Stream the current line to the UI with an HTML break
#                 yield output.strip() + "<br>"

#         # Read any remaining output after the process has finished
#         remaining_output = process.stdout.read()
#         if remaining_output:
#             yield remaining_output.strip() + "<br>"

#         # Include the process's return code at the end
#         yield f"Execution completed with return code: {process.returncode}<br>"

#     # Return the response to the frontend
#     return Response(stream_with_context(stream_output()), mimetype='text/html')


# async def run_command():
#     config = load_config(config_file_path)
#     dir = config.get("venv_path")
#     venv_path = os.path.join(dir, ".venv", "Scripts", "activate")
#     src_dir = os.path.join(dir, "src")
#     script_path = os.path.join(src_dir, "batch", "from_UI", "scripts.bat")

#     command = f'start cmd /k "cd /d {dir} && call {venv_path} && cd src && call {script_path}"'
#     process = await asyncio.create_subprocess_shell(
#         command,
#         stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
#     )

#     async for line in process.stdout:
#         print("Output:", line.decode().strip())

#     await process.wait()
# asyncio.run(run_command())


# async def run_command():
#     """Runs the batch script asynchronously and prints logs in real-time."""
    
#     config = load_config(config_file_path)
#     dir = config.get("venv_path")
#     venv_path = os.path.join(dir, ".venv", "Scripts", "activate")
#     src_dir = os.path.join(dir, "src")
#     script_path = os.path.join(src_dir, "batch", "from_UI", "scripts.bat")

#     command = f'start cmd /k "cd /d "{dir}" && call "{venv_path}" && cd src && call "{script_path}"'
    
#     process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True, text=True)
#     while True:
#         output=process.stdout.readline()
#         if output == '' and process.poll() is not None:
#             break
#         if output:
#             print("Output:", output)

#     remaining_output = process.stdout.read()
#     print("Remaining Output:", remaining_output)    
    
# def execute():
#     """Runs the async function in a synchronous Flask context."""
#     asyncio.run(run_command()) 

def execute():
    """Runs the batch file and streams initial/final messages, then prints all logs at once."""
    config = load_config(config_file_path)
    dir = config.get("venv_path")
    venv_path = os.path.join(dir, ".venv", "Scripts", "activate")
    src_dir = os.path.join(dir, "src")
    script_path = os.path.join(src_dir, "batch", "from_UI", "scripts.bat")

    log_path = os.path.join(dir, "logs", "script_log.txt")
    command = f'start cmd /k "cd /d {dir} && call {venv_path} && cd src && call {script_path}'
    subprocess.Popen(command,stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    def generate():
        yield "data: Script started...\n\n"
        yield "data: Script running...\n\n"

        # Wait and read the log file progressively
        seen_lines = set()
        while True:
            if os.path.exists(log_path):
                with open(log_path, 'r', encoding='utf-8') as f:
                    lines = f.readlines()
                    new_lines = [line.strip() for line in lines if line not in seen_lines]
                    for line in new_lines:
                        yield f"data: {line}\n\n"
                    seen_lines.update(lines)

                    # Stop if script finished marker is found
                    if any("Process finished" in line for line in lines):
                        break
            time.sleep(1)

        yield "data: Script execution completed\n\n"
        yield "data: ----- End of Logs -----\n\n"

    return Response(stream_with_context(generate()), mimetype='text/event-stream')


def save_feature_file(feature_file_name, scenarios):
    try:
        config = load_config(config_file_path)
        feature_path = config.get("features_path")

        if not feature_path:
            return {"error": "features_path not found in config"}, 400
        feature_folder = os.path.join(feature_path, "features_from_UI")
        os.makedirs(feature_folder, exist_ok=True) 

        feature_file_path = os.path.join(feature_folder, feature_file_name)
        print(f'feature path:{feature_file_path}')
        with open(feature_file_path, "w", encoding="utf-8") as f:
            f.write(f"Feature: {feature_file_name.replace('.feature', '')}\n\n")
            for scenario, steps in scenarios.items():
                f.write(f"  Scenario: {scenario}\n")
                for step in steps:
                    f.write(f"    {step}\n")
                f.write("\n")

        return jsonify({"message": f"Feature file '{feature_file_name}' saved successfully!"}),200

    except Exception as e:
        return {"error": str(e)}, 500