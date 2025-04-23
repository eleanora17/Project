import os
import re
import json

def __formatString(inputStr: str):
    """Formats the decorator string by removing special characters."""
    inputStr = inputStr.strip()
    inputStr = re.sub(pattern=r"@\w+", string=inputStr, repl="")
    inputStr = inputStr.replace("(", " ").replace(")", "")
    inputStr = inputStr.replace("{", "<").replace("}", ">")
    return inputStr.strip()

def generateStepsCatalogueFromDirectory(input_dir_path, output_dir_path=""):
    """Generates a JSON catalogue of decorators found in Python files within a directory."""
    
    if not os.path.exists(input_dir_path):
        print("Invalid Input Directory")
        return
    
    if output_dir_path and not os.path.exists(output_dir_path):
        print("Invalid Output Directory")
        return
    
    # Use current working directory if no output directory is provided
    if not output_dir_path:
        output_dir_path = os.getcwd()
    
    decoratorPattern = re.compile(r'^#*@[\w]+\([^)]*\)', re.MULTILINE)
    catalogueJson = {}

    input_dir_path = os.path.normpath(input_dir_path)
    output_dir_path = os.path.normpath(output_dir_path)

    for root, _, files in os.walk(input_dir_path):
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)

                with open(file_path, "r", encoding="utf-8") as currentFile:
                    content = currentFile.read()

                    for occurrence in decoratorPattern.findall(content):
                        formattedStr = __formatString(occurrence)
                        file_key = file.split('.')[0]  # Extract filename without extension

                        if file_key in catalogueJson:
                            catalogueJson[file_key].append(formattedStr)
                        else:
                            catalogueJson[file_key] = [formattedStr]

    output_file = os.path.join(output_dir_path, "pySteps.json")

    # Writing JSON with indentation
    with open(output_file, "w", encoding="utf-8") as jsonFile:
        json.dump(catalogueJson, jsonFile, indent=4)

    print(f"JSON file saved at: {output_file}")
