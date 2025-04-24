//steps
// document.addEventListener('DOMContentLoaded', function() {
//     var elems = document.querySelectorAll('.collapsible');
//     M.Collapsible.init(elems, { accordion: false });

//     document.body.addEventListener('dragover', function(event) {
//         if (event.target.classList.contains('drop-zone')) {
//             event.preventDefault();
//         }
//     });

//     document.body.addEventListener('drop', function(event) {
//         if (event.target.classList.contains('drop-zone')) {
//             event.preventDefault();
//             let data = event.dataTransfer.getData("text/plain");
        
//             // Create a new step element
//             let newItem = document.createElement("div");
//             newItem.innerHTML = `<strong>${data}</strong>`;
//             newItem.classList.add("dropped-item");
//             newItem.setAttribute("draggable", "true");
//             newItem.style.backgroundColor = "#dcdcdc";
//             newItem.style.cursor = "grab";
//             newItem.style.display= "flex"; 
//             newItem.style.justifyContent= "space-between"; 
//             newItem.style.alignItems= "center";
//             newItem.style.padding="0px";
//             newItem.style.paddingLeft="5px";
//             newItem.style.margin="5px";

//             //delete
//             let deleteBtn = document.createElement("i");
//             deleteBtn.classList.add("fa-solid", "fa-xmark", "delete-scenario");
//             deleteBtn.style.padding = "10px";
//             deleteBtn.style.cursor = "pointer";
//             deleteBtn.style.color="red";
//             deleteBtn.addEventListener("click", function() {
//                 newItem.remove();
//             });

//             newItem.appendChild(deleteBtn);
//             event.target.appendChild(newItem);
//             makeStepsDraggable(event.target);
//         }

//     });

//     function makeStepsDraggable(stepsContainer) {
//         let draggedItem = null;

//         stepsContainer.addEventListener("dragstart", function(event) {
//             if (event.target.classList.contains("dropped-item")) {
//                 draggedItem = event.target;
//                 event.target.style.opacity = "0.5";
//             }
//         });

//         stepsContainer.addEventListener("dragend", function(event) {
//             if (draggedItem) {
//                 draggedItem.style.opacity = "1";
//                 draggedItem = null;
//             }
//         });

//         stepsContainer.addEventListener("dragover", function(event) {
//             event.preventDefault();
//             const afterElement = getDragAfterElement(stepsContainer, event.clientY);
//             if (afterElement == null) {
//                 stepsContainer.appendChild(draggedItem);
//             } else {
//                 stepsContainer.insertBefore(draggedItem, afterElement);
//             }
//         });
//     }

//     function getDragAfterElement(container, y) {
//         const draggableElements = [...container.querySelectorAll(".dropped-item:not(.dragging)")];

//         return draggableElements.reduce((closest, child) => {
//             const box = child.getBoundingClientRect();
//             const offset = y - box.top - box.height / 2;
//             if (offset < 0 && offset > closest.offset) {
//                 return { offset: offset, element: child };
//             } else {
//                 return closest;
//             }
//         }, { offset: Number.NEGATIVE_INFINITY }).element;
//     }
    
// });
function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.innerText);
}

window.storedKeyValues = window.storedKeyValues || {};
let droppedFiles = []; // Stores all dropped file names
let featureName="";
// features
document.addEventListener("DOMContentLoaded", function () {
    var container = document.getElementById("main-container");
    var modalElem = document.getElementById("feature-modal");
    var modalInstance = M.Modal.init(modalElem);

    document.getElementById("open-modal").addEventListener("click", function () {
        modalInstance.open();
    });
    
    
    document.getElementById("create-feature").addEventListener("click", function () {
        featureName = document.getElementById("modal-feature-input").value.trim(); 
        createFeature(featureName);
    });
    

    document.getElementById("modal-feature-input").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            featureName = event.target.value.trim(); 
            createFeature(featureName);
        }
    });
    

    function createFeature(featureName) {
        if (featureName === "") {
            alert("Feature name cannot be empty!");
            return;
        }

        modalInstance.close();

        // Wait for the modal to close before updating the content
        setTimeout(() => {
            container.innerHTML = `
                <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                    <span class="card-title" id="feature-name" style="color:rgb(18, 86, 134);"><b>${featureName}</b></span>
                    <div style="display: flex; align-items: center;">
                        <input type="text" id="scenario-input" placeholder="Enter scenario name" class="browser-default" style="width: 200px; height: 30px;">
                        <button id="add-scenario" class="btn-small waves-effect waves-light" style="margin-left: 15px; background-color:#367588">+ Add</button>
                        <button id="reset-feature" class="btn-small waves-effect waves" style="margin-left: 15px; background-color:#367588">Reset</button>
                        <button onclick="openMonaco()" id="view-feature" class="btn-small waves-effect waves" style="margin-left: 15px; background-color:#367588">Editor</button>
                        <button onclick="openSaveModal()" id="save-feature" class="btn-small waves-effect waves" style="margin-left: 15px; background-color:rgb(4, 105, 0);">Save Feature</button>
                    </div>
                </div>
                <div id="scenario-container" class="sortable-scenarios"></div>
            `;

            document.getElementById("modal-feature-input").value = "";

            // Remove modal overlay in case it's stuck
            document.querySelectorAll('.modal-overlay').forEach(el => el.remove());

            // Re-attach event listeners
            document.getElementById("reset-feature").addEventListener("click", resetFeature);
            document.getElementById("scenario-input").addEventListener("keypress", function(event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    addScenario();
                }
            });
            document.getElementById("add-scenario").addEventListener("click", function () {
                addScenario();
            });

        }, 300); // Small delay to allow modal to fully close
    }

    function resetFeature() {
        container.innerHTML = `
            <div class="card-header" style="display: flex; align-items: center">
                <button id="open-modal" class="btn-small waves-effect waves-light" style="background-color:#367588; width: 40%; margin: 20px; align-items: center;">
                    Create Feature
                </button>
            </div>
        `;

        // Reattach modal open event after reset
        document.getElementById("open-modal").addEventListener("click", function () {
            modalInstance.open();
        });
    }

    function addScenario() {
        let scenarioInput = document.getElementById("scenario-input");
        let scenarioName = scenarioInput.value.trim();
        if (scenarioName !== "") {
            let scenarioItem = document.createElement("div");
            scenarioItem.classList.add("draggable-scenario");
            scenarioItem.setAttribute("draggable", "true");
            scenarioItem.style.marginTop = "10px";
            
            scenarioItem.innerHTML = `
                <div style="background-color: #536878; color: white; padding-left: 10px; padding:5px; cursor: grab; display: flex; justify-content: space-between; align-items: center;">
                    <strong>${scenarioName}</strong>
                    <i class="fa-solid fa-xmark delete-scenario" style="padding-right: 10px;cursor: pointer; color: white;"></i>
                </div>
                <div class="steps-drop-zone" style="border: 1px solid #c0c0c0; padding: 10px;;"><span style="color:rgb(20, 115, 184)">@Steps:</span></div>
            `;

            document.getElementById("scenario-container").appendChild(scenarioItem);
            scenarioInput.value = "";

            scenarioItem.querySelector(".delete-scenario").addEventListener("click", function() {
                scenarioItem.remove();
            });

            makeScenariosDraggable();
        }
    }

    function makeScenariosDraggable() {
        let container = document.getElementById("scenario-container");
        let draggedItem = null;

        container.addEventListener("dragstart", function(event) {
            if (event.target.classList.contains("draggable-scenario")) {
                draggedItem = event.target;
                event.target.style.opacity = "0.5";
            }
        });

        container.addEventListener("dragend", function(event) {
            if (draggedItem) {
                draggedItem.style.opacity = "1";
                draggedItem = null;
            }
        });

        container.addEventListener("dragover", function(event) {
            event.preventDefault();
            const afterElement = getDragAfterElement(container, event.clientY);
            if (afterElement == null) {
                container.appendChild(draggedItem);
            } else {
                container.insertBefore(draggedItem, afterElement);
            }
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll(".draggable-scenario:not(.dragging)")];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    //steps drop
    document.body.addEventListener('drop', function (event) {
        if (event.target.classList.contains('steps-drop-zone')) {
            event.preventDefault();
            let data = event.dataTransfer.getData("text/plain");
    
            let dropText = event.target.querySelector(".drop-text");
            if (dropText) {
                dropText.remove();
            }
    
            droppedFiles.push(data);
    
            // Create a new UI element for the dropped file
            let stepItem = document.createElement("div");
            stepItem.classList.add("dropped-item");
            stepItem.setAttribute("draggable", "true");
            stepItem.setAttribute("data-file", data);
            
            // ✅ Apply flex styling for proper layout
            stepItem.style.display = "flex";
            stepItem.style.alignItems = "center";
            stepItem.style.gap = "10px"; // Adds spacing between elements
            stepItem.style.padding = "5px";
            stepItem.style.border = "1px solid #ccc";
            stepItem.style.margin = "5px 0";
            stepItem.style.backgroundColor = "#f8f9fa";
            stepItem.style.borderRadius = "5px";
    
            // ✅ Dropdown for selecting step type
            let dropdown = document.createElement("select");
            dropdown.classList.add("step-type-selector");
            dropdown.style.marginRight = "10px";
            dropdown.style.padding = "5px";
            dropdown.style.borderRadius = "4px";
            dropdown.style.cursor = "pointer";
    
            ["Given", "When", "Then", "And"].forEach(optionText => {
                let option = document.createElement("option");
                option.value = optionText;
                option.textContent = optionText;
                dropdown.appendChild(option);
            });
    
            // ✅ Ensure the dropdown is visible
            dropdown.style.display = "inline-block";
    
            // ✅ Text container for step
            let stepText = document.createElement("span");
            stepText.textContent = `${dropdown.value} ${data}`; // Default prefix with dropdown value
            stepText.style.flexGrow = "1";
    
            // Update text when dropdown is changed
            dropdown.addEventListener("change", function () {
                stepText.textContent = `${dropdown.value} ${data}`;
            });
    
            // Buttons container
            let buttonWrapper = document.createElement("div");
            buttonWrapper.classList.add("button-wrapper");
            buttonWrapper.style.display = "flex";
            buttonWrapper.style.gap = "8px"; // Add spacing between buttons
    
            // Delete button
            let deleteBtn = document.createElement("i");
            deleteBtn.classList.add("fa-solid", "fa-xmark", "delete-scenario");
            deleteBtn.style.cursor = "pointer";
            deleteBtn.style.marginLeft = "5px";
            deleteBtn.addEventListener("click", function () {
                stepItem.remove();
                droppedFiles = droppedFiles.filter(file => file !== data);
                console.log("Updated Dropped Files:", droppedFiles);
            });
    
            // Edit button
            let editBtn = document.createElement("i");
            editBtn.classList.add("fa-solid", "fa-pen-to-square", "edit-scenario");
            editBtn.style.cursor = "pointer";
            editBtn.style.marginLeft = "5px";
            editBtn.addEventListener("click", function () {
                window.openFeatureModal(data);
            });
    
            // View button
            let viewBtn = document.createElement("i");
            viewBtn.classList.add("fa-solid", "fa-code", "view-scenario");
            viewBtn.style.cursor = "pointer";
            viewBtn.style.marginLeft = "5px";
            viewBtn.addEventListener("click", function () {
                console.log("Viewing file content:", data);
                openMonacoEditor(data);
            });
    
            // Assemble buttons
            buttonWrapper.appendChild(viewBtn);
            buttonWrapper.appendChild(editBtn);
            buttonWrapper.appendChild(deleteBtn);
    
            // ✅ Append elements in the correct order
            stepItem.appendChild(dropdown); // Dropdown first
            stepItem.appendChild(stepText); // Step text next
            stepItem.appendChild(buttonWrapper); // Buttons last
    
            // Append step item to the drop zone
            event.target.appendChild(stepItem);
    
            console.log("Dropped Files:", droppedFiles);
            makeFeaturesDraggable(event.target);
        }
    });
    
    
});



// //popup
$(document).ready(function () {
    // Initialize the modal
    var modalElem = document.getElementById('feature-modal');
    var modalInstance = M.Modal.init(modalElem);

    // Open modal on button click
    $("#open-modal").click(function () {
        modalInstance.open();
    });

    // Handle save button click
    $("#save-feature").on("click", function () {
        let featureName = $("#modal-feature-input").val().trim();
    
        if (featureName !== "") {
            console.log("Feature Name:", featureName); // Logs the name to the console
        } else {
            alert("Please enter a valid feature name.");
        }
    });    
});

//header-folders
document.addEventListener("DOMContentLoaded", function () {
    // Select the collapsible container
    let headers = document.querySelectorAll(".collapsible-header");

    headers.forEach(header => {
        header.addEventListener("click", function () {
            let icon = header.querySelector("i");

            if (icon.classList.contains("fa-folder")) {
                icon.classList.remove("fa-folder");
                icon.classList.add("fa-folder-open");
            } else {
                icon.classList.remove("fa-folder-open");
                icon.classList.add("fa-folder");
            }
        });
    });
});



//drag-features
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems, { accordion: false });


    document.body.addEventListener('dragover', function (event) {
        if (event.target.classList.contains('drop-zone')) {
            event.preventDefault();
        }
    });

    document.body.addEventListener('drop', function (event) {
        if (event.target.classList.contains('drop-zone')) {
            event.preventDefault();
            let data = event.dataTransfer.getData("text/plain");

            let dropText = event.target.querySelector(".drop-text");
            if (dropText) {
                dropText.remove();
            }

            droppedFiles.push(data);

            // Create a new UI element for the dropped file
            let newItem = document.createElement("div");
            newItem.textContent = data;
            newItem.classList.add("dropped-item");
            newItem.setAttribute("draggable", "true");
            newItem.setAttribute("data-file", data);

            let buttonWrapper = document.createElement("div");
            buttonWrapper.classList.add("button-wrapper");
            
            //delete button
            let deleteBtn = document.createElement("i");
            deleteBtn.classList.add("fa-solid", "fa-xmark", "delete-scenario");
            deleteBtn.addEventListener("click", function () {
                newItem.remove();
                droppedFiles = droppedFiles.filter(file => file !== data); 
                console.log("Updated Dropped Files:", droppedFiles); 
            });
            
            //edit button
            let editBtn = document.createElement("i");
            editBtn.classList.add("fa-solid", "fa-pen-to-square", "edit-scenario"); 
            editBtn.addEventListener("click", function () {
                window.openFeatureModal(data);
            });

            let viewBtn = document.createElement("i");
            viewBtn.classList.add("fa-solid", "fa-code", "view-scenario");
            viewBtn.addEventListener("click", function () {
                console.log("Viewing file content:", data);
                openMonacoEditor_features(data);
            });

            // newItem.addEventListener("click", function () {
            //     window.openFeatureModal(data);
            // });

            // newItem.appendChild(deleteBtn);
            // newItem.appendChild(editBtn);
            buttonWrapper.appendChild(viewBtn);
            buttonWrapper.appendChild(editBtn);
            buttonWrapper.appendChild(deleteBtn);

            newItem.appendChild(buttonWrapper);
            event.target.appendChild(newItem);

            console.log("Dropped Files:", droppedFiles); 
            makeFeaturesDraggable(event.target);
        }
        
    });
    
    // document.getElementById("runButton").addEventListener("click", function() {
    //     fetch("/run_feature_files", {  // API Endpoint
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({ files: droppedFiles }) // Send dropped file names
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log("Response from backend:", data);
    //     })
    //     .catch(error => {
    //         console.error("Error:", error);
    //     });
    // });
    
    document.getElementById("runButton").addEventListener("click", function () {
        const logContainer = document.getElementById("log-container");
        logContainer.innerHTML = "<div style='color: lightgreen;'>Script started...</div>"; 
    
        // First API call: /run_feature_files
        fetch("/run_feature_files", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ files: droppedFiles })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to run feature files");
            }
            return response.json();
        })
        .then(() => {
            console.log("Feature files execution triggered.");
    
            // Add running message
            logContainer.innerHTML += `<div style='color: lightblue;'>Script running...</div>`;
    
            // Wait 5 seconds before showing final logs
            setTimeout(() => {
                fetch("/get_logs")
                    .then(res => res.json())
                    .then(data => {
                        logContainer.innerHTML += `<div style='color: lightgreen;'>Script execution completed.</div>`;
                        logContainer.innerHTML += `<pre style='color: #ddd;'>${data.logs}</pre>`;
                    });
            }, 5000); // adjust based on how long your script usually takes
        })
        .catch(error => {
            console.error("Error:", error);
            logContainer.innerHTML += `<div style="color: red;">Error: ${error.message}</div>`;
        });
    });
    
    
    document.getElementById("saveButton").addEventListener("click", function() {
        var saveBatModal = M.Modal.getInstance(document.getElementById("save-bat-modal"));
        saveBatModal.open();
    });

    document.getElementById("create-bat").addEventListener("click", function() {
        var batInput = document.getElementById("modal-bat-input");
        var batFileName = batInput.value.trim(); // Get file name
        if (!batFileName) {
            M.toast({ html: "❌ Please enter a file name!", classes: "red" });
            return;
        }
    
        // Ensure file name has .bat extension
        if (!batFileName.endsWith(".bat")) {
            batFileName += ".bat";
        }
    
        // Collect all key-value pairs from dropped feature files
        let featureFiles = [];
        let keyValueData = {};
        document.querySelectorAll(".dropped-item").forEach(item => {
            let fileName = item.getAttribute("data-file");
            featureFiles.push(fileName);
            let keyValues = [];
            let keyValueBox = item.querySelector(".key-value-box");
            if (keyValueBox) {
                keyValueBox.querySelectorAll("p").forEach(p => {
                    let [key, value] = p.textContent.split(":").map(s => s.trim());
                    keyValues.push({ key, value });
                });
            }
    
            if (keyValues.length > 0) {
                keyValueData[fileName] = keyValues;
            }
        });
        batInput.value = "";
    
        // Send data to backend
        fetch("/save_bat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                file_name: batFileName, 
                files: featureFiles, 
                key_values: keyValueData // Sending key-value pairs
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                M.toast({ html: "✅ " + data.message, classes: "green" });
            } else {
                M.toast({ html: "❌ " + data.error, classes: "red" });
            }
        })
        .catch(error => {
            console.error("Error saving batch file:", error);
            M.toast({ html: "⚠️ Error saving file", classes: "red" });
        });
    });

    document.getElementById("saveData").addEventListener("click", function () {
        let keyValuePairs = [];

        let rows = document.querySelectorAll("#key-value-container tr");
        rows.forEach(row => {
            let keyInput = row.querySelector(".key-input").value.trim();
            let valueInput = row.querySelector(".value-input").value.trim();

            if (keyInput && valueInput) {
                keyValuePairs.push({ key: keyInput, value: valueInput });
            }
        });

        console.log("Key-Value Pairs:", keyValuePairs); // Debugging output

        // Find the currently selected file
        let modal = document.getElementById("data-modal");
        let fileName = modal.getAttribute("data-file");

        if (!fileName) return; // Safety check

        // Store the key-value pairs for the file
        storedKeyValues[fileName] = keyValuePairs;

        // Find the corresponding dropped item in the UI
        let droppedItem = document.querySelector(`.dropped-item[data-file="${fileName}"]`);
        if (!droppedItem) return;

        // Check if a key-value container already exists inside the dropped item
        let existingKeyValueBox = droppedItem.querySelector(".key-value-box");
        if (existingKeyValueBox) {
            existingKeyValueBox.remove(); // Remove old key-value pairs
        }

        // Create new key-value container
        let keyValueBox = document.createElement("div");
        keyValueBox.classList.add("key-value-box");

        keyValuePairs.forEach(pair => {
            let p = document.createElement("p");
            p.textContent = `"${pair.key}: ${pair.value}"`; 
            keyValueBox.appendChild(p);
        });
        droppedItem.appendChild(keyValueBox);


        let instance = M.Modal.getInstance(modal);
        instance.close();
    });
});    

function makeFeaturesDraggable(stepsContainer) {
    let draggedItem = null;

    // Attach event to entire container
    stepsContainer.addEventListener("dragstart", function (event) {
        if (event.target.classList.contains("dropped-item")) {
            draggedItem = event.target;
            event.target.style.opacity = "0.5";
            event.target.classList.add("dragging");
        }
    });

    stepsContainer.addEventListener("dragend", function (event) {
        if (draggedItem) {
            draggedItem.style.opacity = "1";
            draggedItem.classList.remove("dragging");
            draggedItem = null;
        }
    });

    stepsContainer.addEventListener("dragover", function (event) {
        event.preventDefault();
        const afterElement = getDragAfterElement(stepsContainer, event.clientY);
        if (afterElement == null) {
            stepsContainer.appendChild(draggedItem);
        } else {
            stepsContainer.insertBefore(draggedItem, afterElement);
        }
    });
}

// let storedKeyValues = {}; 
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".dropped-item:not(.dragging)")];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

window.openFeatureModal = function (fileName){
    let modal = document.getElementById("data-modal");
    let modalBody = document.getElementById("modal-body");
    modal.setAttribute("data-file", fileName);

    // Check if data exists for this file
    if (!window.storedKeyValues) {
        window.storedKeyValues = {};
    }
    let existingData = window.storedKeyValues[fileName] || [];

    modalBody.innerHTML = `
    <b>Add data parameters for: ${fileName}</b>
    <table class="highlight">
        <thead>
            <tr>
                <th>Key</th>
                <th>Value</th>
                <th>
                    <button id="addRowBtn" class="btn-small" style="background-color:#367588; color: white; margin-left: 10px;">
                        + Add
                    </button>
                </th>
            </tr>
        </thead>
        <tbody id="key-value-container">
            ${existingData.map(pair => `
                <tr>
                    <td><input type="text" class="key-input" value="${pair.key}"></td>
                    <td><input type="text" class="value-input" value="${pair.value}"></td>
                    <td>
                        <button class="btn-small remove-row">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join("")}
        </tbody>
    </table>
    `;
    document.getElementById("key-value-container").addEventListener("click", function (event) {
        if (event.target.closest(".remove-row")) {
            event.target.closest("tr").remove();
        }
    });

    document.getElementById("addRowBtn").addEventListener("click", function () {
        let container = document.getElementById("key-value-container");
        let newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><input type="text" class="key-input"></td>
            <td><input type="text" class="value-input"></td>
            <td>
                <button class="btn-small remove-row">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        container.appendChild(newRow);
    });

    var instance = M.Modal.getInstance(modal);
    instance.open();
}

$(document).ready(function () {
    $(".tabs").tabs(); // Initialize Materialize tabs

    $("#features-tab").click(function () {
        $.ajax({
            url: "/features", // API to fetch features
            type: "GET",
            success: function (data) {
                let featureHTML = `
                    <ul class="collapsible expandable">
                `;

                for (let folder in data) {
                    featureHTML += `
                        <li>
                            <div class="collapsible-header white-text" style="background-color: #0a2f45; padding: 0.5em;">
                                <span style="padding-right: 0.2em;">
                                    <i class="fa-solid fa-folder"></i>
                                </span>
                                <span>${folder}</span>
                            </div>
                            <div class="collapsible-body padding_0_25">
                                <div style="display: flex; flex-direction: column; justify-content: center; width: 100%;">`;

                    data[folder].forEach((file, index) => {
                        featureHTML += `
                            <div class="draggable-item" 
                                id="file-${index}-${folder}" 
                                draggable="true" 
                                ondragstart="drag(event)"
                                style="display: flex; align-items: center; padding: 0.5rem; margin: 0.25rem; 
                                box-shadow: 0 0 4px 1px gray; border-radius: 2px; height: 2.5rem;">
                                
                                <i class="fa-solid fa-file-code" style="padding-right: 10px;font-size: large;"></i>
                                <span>${file.file_name}</span>
                            </div>`;
                    });

                    featureHTML += `</div></div></li>`;
                }

                featureHTML += `</ul>`;

                $("#features-content").html(featureHTML);
                $(".collapsible").collapsible(); // Reinitialize Materialize collapsible
            },
            error: function () {
                $("#features-content").html("<p>Error fetching feature files.</p>");
            }
        });
    });
});
// function Refresh() {
//     let activeTab = document.querySelector(".tabs .active").getAttribute("href");

//     if (activeTab === "#features-tab") {
//         fetch("/refresh_features")  // Call Flask API to get fresh feature data
//             .then(response => response.json())
//             .then(data => {
//                 document.getElementById("features-content").innerHTML = data.html; // Update the UI with new data
//                 M.Collapsible.init(document.querySelectorAll(".collapsible")); // Reinitialize collapsible
//             })
//             .catch(error => console.error("Error refreshing features:", error));
//     } 
    
//     else if (activeTab === "#batch-tab") {
//         fetch("/refresh_batches")  // Call Flask API to get fresh batch file data
//             .then(response => response.json())
//             .then(data => {
//                 document.getElementById("batch-content").innerHTML = data.html; // Update the UI with new data
//             })
//             .catch(error => console.error("Error refreshing batch files:", error));
//     }
// }


// function loadBatchFile(element) {
//     var fileName = element.getAttribute('data-name'); // Get the file name

//     fetch("/get_bat_content", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ file_name: fileName }), // Send file name as JSON
//     })
//     .then(response => response.json())
//     .then(data => {
//         var content = data.content || "No content found"; // Get file content
//         document.getElementById('batchFileName').innerText = fileName;

//         // Insert the content into the modal
//         document.getElementById('batchFileContent').innerText = content;

//         // Open the Materialize modal
//         var modal = M.Modal.getInstance(document.getElementById('batchFileModal'));
//         modal.open();
//     })
//     .catch(error => {
//         console.error("Error fetching batch file content:", error);
//         document.getElementById('batchFileContent').innerText = "Error loading file content.";
//     });
//     document.getElementById('batchFileContent').innerHTML = '<div class="progress"><div class="indeterminate"></div></div>';
// }
function loadBatchFile(element) {
    var fileName = element.getAttribute('data-name'); // Get the batch file name
    console.log("Loading batch file:", fileName);

    fetch("/get_bat_content", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_name: fileName }), // Send file name to API
    })
    .then(response => response.json())
    .then(data => {
        if (!data.content) {
            console.error("No content found in the batch file.");
            return;
        }

        var dropZone = document.getElementById("feature-files");
        if (!dropZone) {
            console.error("Drop zone not found!");
            return;
        }

        dropZone.innerHTML = ""; // Clear existing files before adding new ones
        droppedFiles = []; // Reset dropped files array

        // Extract feature file paths from batch file content
        var lines = data.content.split("\n");
        console.log("Batch file content:", lines); // Debugging: Check extracted lines

        lines.forEach(line => {
            console.log("Processing line:", line); // Debugging: Check each line

            var match = line.match(/behave\s+\.\\(.+?\.feature)/); // Extract feature path
            if (match) {
                var featureFile = match[1].split("\\").pop(); // Get only file name
                console.log("Extracted feature file:", featureFile); // Debugging

                // Ensure the file is not duplicated
                if (!droppedFiles.includes(featureFile)) {
                    droppedFiles.push(featureFile);

                    // Create dropped item element
                    var droppedItem = document.createElement("div");
                    droppedItem.setAttribute("data-file", featureFile);
                    droppedItem.classList.add("dropped-item");
                    droppedItem.innerHTML = `
                        <span>${featureFile}</span>
                    `;

                    let deleteBtn = document.createElement("i");
                    deleteBtn.classList.add("fa-solid", "fa-xmark", "delete-scenario");
                    deleteBtn.addEventListener("click", function () {
                        droppedItem.remove();
                        droppedFiles = droppedFiles.filter(file => file !== featureFile);
                        console.log("Updated Dropped Files:", droppedFiles);
                    });

                    droppedItem.addEventListener("click", function () {
                        console.log("Clicked on batch-loaded item:", featureFile);
                        window.openFeatureModal(featureFile);
                    });

                    droppedItem.appendChild(deleteBtn);
                    dropZone.appendChild(droppedItem);
                }
            } else {
                console.warn("No match found in line:", line);
            }
        });

        console.log("Final Dropped Files List:", droppedFiles); // Debugging
    })
    .catch(error => {
        console.error("Error fetching batch file content:", error);
    });
}




document.addEventListener('DOMContentLoaded', function() {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
});
//parsing step files
document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("edit-scenario")) {
            let droppedItem = event.target.closest(".dropped-item"); // Get the parent dropped item
            if (!droppedItem) return; // Ensure it's inside a valid dropped item

            let stepTextElement = droppedItem.querySelector("span"); // Find the step text element
            let text = stepTextElement ? stepTextElement.textContent.trim() : "";
            let matches = text.match(/<([^>]+)>/g);

            if (matches) {
                let modalBody = document.getElementById("modal-body");
                modalBody.innerHTML = ""; // Clear previous content

                let originalTextDiv = document.createElement("div");
                originalTextDiv.style.fontWeight = "bold";
                originalTextDiv.style.marginBottom = "10px";
                originalTextDiv.textContent = `${text}`;
                modalBody.appendChild(originalTextDiv);

                matches.forEach((match, index) => {
                    let cleanMatch = match.replace(/<|>/g, ""); // Remove < and >
                    let inputContainer = document.createElement("div");
                    inputContainer.style.display = "flex";
                    inputContainer.style.flexDirection = "column";
                    inputContainer.style.marginBottom = "10px";

                    let label = document.createElement("label");
                    label.textContent = cleanMatch;
                    label.style.fontWeight = "bold";

                    let input = document.createElement("input");
                    input.type = "text";
                    input.id = `input-${index}`;
                    input.classList.add("browser-default");
                    input.style.padding = "5px";
                    input.style.border = "1px solid #ccc";
                    input.style.borderRadius = "4px";

                    inputContainer.appendChild(label);
                    inputContainer.appendChild(input);
                    modalBody.appendChild(inputContainer);
                });

                // Store the clicked element to update it later
                document.getElementById("save-modal").setAttribute("data-target", text);
                document.getElementById("save-modal").setAttribute("data-item-id", droppedItem.dataset.file); // Unique identifier for update

                // Open the modal
                let modal = M.Modal.getInstance(document.getElementById("edit-modal"));
                modal.open();
            }
        }
    });

    // Save updated input values and replace text without affecting dropdown
    document.getElementById("save-modal").addEventListener("click", function () {
        let originalText = this.getAttribute("data-target"); // Get original text
        let itemId = this.getAttribute("data-item-id"); // Identify the specific dropped item
        let inputs = document.querySelectorAll("#modal-body input");

        inputs.forEach((input) => {
            originalText = originalText.replace(/<([^>]+)>/, input.value); // Replace first match
        });

        // Update only the span that contains the step text
        document.querySelectorAll(".dropped-item").forEach(item => {
            if (item.dataset.file === itemId) {
                let stepTextElement = item.querySelector("span");
                if (stepTextElement) {
                    stepTextElement.textContent = originalText;
                }
            }
        });
    });
});



function refreshSteps() {
    fetch("/refresh_steps")
        .then(response => response.json())
        .then(data => {
            console.log("Received Data:", data.html);
            const stepsContainer = document.getElementById("stepsContainer");

            if (stepsContainer) {
                stepsContainer.innerHTML = data.html;  // Replace only macro section
                M.Collapsible.init(document.querySelector(".collapsible"));  // Reinitialize UI

                // 🔹 Rebind event listener after refresh
                document.getElementById("refreshSteps").addEventListener("click", refreshSteps);
                
            } else {
                console.error("Error: stepsContainer not found!");
            }
        })
        .catch(error => console.error("Error refreshing steps:", error));
}

// 🔹 Attach event listener on page load
document.getElementById("refreshSteps").addEventListener("click", refreshSteps);


//refresh features & bat files
// function refreshFeatureFiles() {
//     fetch('/refresh_features', {
//         method: 'GET',
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             location.reload(); // Reload the page to reflect changes
//         } else {
//             console.error("Failed to refresh features:", data.message);
//         }
//     })
//     .catch(error => {
//         console.error("Error:", error);
//     });
// }

//regenerate steps
function regenerateSteps() {
    fetch("/regenerate_steps", { method: "POST" })
        .then(response => response.json())
        .then(data => {
            const stepsContainer = document.getElementById("stepsContainer");

            if (data.success) {
                console.log("Received Data:", data.html);

                if (stepsContainer) {
                    stepsContainer.innerHTML = data.html;  // Replace only macro section
                    M.Collapsible.init(document.querySelector(".collapsible"));  // Reinitialize UI

                    // 🔹 Rebind event listener after regeneration
                    document.getElementById("regenerateSteps").addEventListener("click", regenerateSteps);

                    // 🔹 Show success toast
                    M.toast({ html: '✅ Steps regenerated successfully!', classes: 'green darken-2' });
                } else {
                    console.error("Error: stepsContainer not found!");
                    M.toast({ html: '⚠️ stepsContainer not found!', classes: 'orange darken-2' });
                }
            } else {
                console.error("Server Error:", data.message);
                M.toast({ html: '❌ Error: ' + data.message, classes: 'red darken-2' });
            }
        })
        .catch(error => {
            console.error("Error regenerating steps:", error);
            M.toast({ html: '❌ Request failed: ' + error.message, classes: 'red darken-2' });
        });
}

// 🔹 Attach event listener on page load
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("regenerateSteps").addEventListener("click", regenerateSteps);
});
                       

//sidenav
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);
});

//load config.json
function loadConfigFile() {
    console.log("Config link clicked! Fetching data...");

    fetch('/api/config')
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Data:", data);
            const container = document.getElementById("config-container");
            container.innerHTML = ""; // Clear previous content

            const card = document.createElement("div");
            card.classList.add("col", "s12");

            let formHTML = `
                <div class="card">
                    <div class="card-content">
                        <span class="card-title"><b style="color:#0a2f45;">Config.json</b></span>
                        <form id="config-form">
                    
            `;


            Object.keys(data).forEach(key => {
                formHTML += `
                    <div class="input-field">
                        <input type="text" class="config-key" value="${key}" data-original-key="${key}" style="font-weight:bold;color:#0a2f45;background: #f4f4f4"/>
                        <input type="text" class="config-value" value="${data[key]}" />
                    </div>
                `;
            });

            formHTML += `
                        <button class="modal-close btn-small waves-effect waves-light" style="margin-top:10px;background-color:rgb(4, 105, 0);" onclick="saveConfig()">Save</button>
                    </form>
                    </div>
                </div>
            `;

            card.innerHTML = formHTML;
            container.appendChild(card);
            window.currentConfig = data; 
        })
        .catch(error => console.error('Error fetching config:', error));
}
function saveConfig() {
    let updatedConfig = {};

    document.querySelectorAll("#config-form .input-field").forEach(field => {
        const oldKey = field.querySelector(".config-key").getAttribute("data-original-key").trim();
        const newKey = field.querySelector(".config-key").value.trim();
        const value = field.querySelector(".config-value").value.trim();

        // If key is changed, update reference
        if (newKey !== oldKey && oldKey in window.currentConfig) {
            delete window.currentConfig[oldKey];
        }

        updatedConfig[newKey] = value;
    });

    // Send updated JSON to the server
    fetch('/api/config', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedConfig)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Config updated:", data);
        M.toast({html: 'Config updated successfully!', classes: 'green'});
    })
    .catch(error => console.error('Error updating config:', error));
}


//saving feature file
let scenarioData = {}; // Global object to store scenarios
document.addEventListener("DOMContentLoaded", function () {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
});

// Open the Save Modal
function openSaveModal() {
    var modalInstance = M.Modal.getInstance(document.getElementById("saveModal"));
    modalInstance.open();
}


// Close the Save Modal
function closeSaveModal() {
    document.getElementById("saveModal").style.display = "none";
}

// Collect Scenario Data and Send to Backend
function saveScenarios() {
    const fileNameInput = document.getElementById("featureFileName");
    const fileName = fileNameInput.value.trim();

    if (!fileName) {
        alert("Please enter a feature file name.");
        return;
    }

    scenarioData = {}; // Reset before collecting data
    document.querySelectorAll("#scenario-container .draggable-scenario").forEach(scenarioDiv => {
        let scenarioName = scenarioDiv.querySelector("strong").innerText;

        let steps = Array.from(scenarioDiv.querySelectorAll(".steps-drop-zone .dropped-item")).map(item => {
            let dropdown = item.querySelector(".step-type-selector");
            let stepText = item.querySelector("span") ? item.querySelector("span").textContent.trim() : "";

            
            let stepWithKeyword = stepText;
            if (dropdown && !stepText.startsWith(dropdown.value)) {
                stepWithKeyword = `${dropdown.value} ${stepText}`;
            }

            // Remove quotes immediately after the keyword and at the end of the step
            stepWithKeyword = stepWithKeyword.replace(/^(\w+)\s*['"]?|['"]$/g, '$1 ');

            return stepWithKeyword.trim();
        });

        console.log("Scenario:", scenarioName, "Steps:", steps); 

        scenarioData[scenarioName] = steps;
    });

    const requestData = {
        feature_file: fileName  + ".feature",
        scenarios: scenarioData
    };

    console.log("Sending JSON to Backend:", requestData);

    
    fetch("/save-feature-file", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        M.toast({ html: data.message, classes: 'rounded green darken-1', displayLength: 3000 });
        closeSaveModal();
    })
    .catch(error => {
        console.error("Error:", error);
        M.toast({ html: 'An error occurred while saving.', classes: 'rounded red darken-1', displayLength: 3000 });
    });
}

function loadGit() {
    console.log("Git link clicked!");

    fetch('/api/get-git-path')
        .then(response => response.json())
        .then(data => {
            const gitPath = data.path || "Path not found";

            document.getElementById("config-container").innerHTML = `
                <div class="card" style>
                    <div class="card-content">
                        <span class="card-title">
                            <b style="color:#0a2f45;">Git Commands</b>
                        </span>

                        <div class="input-field">
                            <input type="text" class="config-key" value="Git pull" 
                                   style="font-weight:bold;color:#0a2f45;background: #f4f4f4" readonly />
                            <input type="text" class="config-value" value="${gitPath} git pull" readonly />
                        </div>
                        <button id="git-status-btn" class="waves-effect waves-light btn" 
                                style="margin-top: 10px;background-color:#367588;" 
                                onclick="runGitStatus('${gitPath}')">
                             Git Status
                        </button>
                        <button id="git-add-btn" class="waves-effect waves-light btn" 
                                style="margin-top: 10px;background-color:#367588;" 
                                onclick="openGitAddModal()">
                             Git Add
                        </button>
                        <button id="git-pull-btn" class="waves-effect waves-light btn" 
                                style="margin-top: 10px;background-color:#367588;" 
                                onclick="runGitPull('${gitPath}')">
                            Git Pull
                        </button>
                        <button class="waves-effect waves-light btn" 
                                style="margin-top: 10px;background-color:#367588;" 
                                onclick="restartApp()">
                            Restart App
                        </button>
                        <div id="status" style="margin-top: 1rem; font-weight: bold;"></div>
                        <!-- Commit Message Modal -->
                        <div id="commit-modal" class="modal">
                            <div class="modal-content">
                            <h5>Enter Commit Message</h5>
                            <input type="text" id="commit-message-input" placeholder="Enter message" class="browser-default" style="width:100%">
                            </div>
                            <div class="modal-footer">
                            <button id="commit-confirm-btn" class="btn waves-effect waves-light" style="background-color:#367588;">
                                Commit & Push
                            </button>
                            <button class="modal-close btn waves-effect waves-light" style="background-color:gray">
                                Cancel
                            </button>
                            </div>
                        </div>
                        
                        <div id="git-add-modal" class="modal">
                            <div class="modal-content">
                                <h5>Select files to stage & commit</h5>
                                
                                <form id="git-file-list" class="browser-default"></form>

                                <div class="input-field" style="margin-top: 20px;">
                                <p>Enter commit message</p>
                                <input type="text" id="git-commit-msg" placeholder="Enter commit message" class="browser-default" style="width:100%">
                                </div>
                            </div>

                            <div class="modal-footer">
                                <button id="git-commit-btn" class="btn waves-effect waves-light" style="background-color:#367588;">
                                Commit & Push
                                </button>
                                <button class="modal-close btn waves-effect waves-light grey darken-1">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error("Error fetching git path:", error);
        });
}


// Function to handle running the git pull command
function runGitPull(gitPath) {
    console.log("Running Git Pull command...");

    const gitPullBtn = document.getElementById("git-pull-btn");
    gitPullBtn.disabled = true; // 🔒 Disable button
    gitPullBtn.innerText = "Pulling..."; // Optional: show status

    fetch('/api/git-pull', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path: gitPath })
    })
    .then(response => response.json())
    .then(data => {
        const logs = `
==== Git Pull Output ====
${data.output || ''}

==== Git Pull Errors ====
${data.error || ''}
`;

        const logElement = document.getElementById("git-log-output");
        const terminalWrapper = document.getElementById("terminal-wrapper");

        logElement.textContent = logs;
        terminalWrapper.style.display = 'block';
        terminalWrapper.scrollTop = terminalWrapper.scrollHeight;
        document.getElementById('commit-message-input').value = '';

        M.toast({ html: 'Git pull completed!', classes: 'green darken-2' });
    })
    .catch(error => {
        console.error('Error running git pull:', error);
        M.toast({ html: 'Failed to run git pull', classes: 'red darken-1' });
    })
    .finally(() => {
        // ✅ Re-enable button after pull completes
        gitPullBtn.disabled = false;
        gitPullBtn.innerText = "Run Git Pull";
    });
}

function runGitStatus(gitPath) {
    console.log("Running Git Status...");

    const statusBtn = document.getElementById("git-pull-btn");
    statusBtn.disabled = true;

    fetch('/api/git-status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ path: gitPath })
    })
    .then(response => response.json())
    .then(data => {
        const logs = `
==== Git Status Output ====
${data.output || ''}

==== Git Status Errors ====
${data.error || ''}
        `;

        const logElement = document.getElementById("git-log-output");
        const terminalWrapper = document.getElementById("terminal-wrapper");

        logElement.textContent += '\n' + logs;
        terminalWrapper.style.display = 'block';
        terminalWrapper.scrollTop = terminalWrapper.scrollHeight;

        M.toast({ html: 'Git status fetched!', classes: 'blue darken-2' });
    })
    .catch(error => {
        console.error('Error running git status:', error);
        M.toast({ html: 'Failed to get git status', classes: 'red darken-1' });
    })
    .finally(() => {
        statusBtn.disabled = false;
    });
}

function openCommitModal(gitPath) {
    console.log("Opening commit modal...");
    
    const modalEl = document.getElementById('commit-modal');
    console.log("Modal element found:", modalEl);

    let instance = M.Modal.getInstance(modalEl);
    if (!instance) {
        instance = M.Modal.init(modalEl);
    }

    document.getElementById('commit-message-input').value = '';
    console.log("Modal instance initialized:", instance);
    instance.open();

    const confirmBtn = document.getElementById('commit-confirm-btn');
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

    newBtn.addEventListener('click', () => {
        console.log("Commit button clicked");

        const message = document.getElementById('commit-message-input').value.trim();
        console.log("Commit message:", message);

        if (!message) {
            M.toast({ html: 'Please enter a commit message!', classes: 'red darken-2' });
            return;
        }

        newBtn.disabled = true;

        fetch('/api/git-commit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, path: gitPath })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Git commit response:", data);

            const logElement = document.getElementById("git-log-output");
            const terminalWrapper = document.getElementById("terminal-wrapper");

            const logs = `
==== Git Commit Flow ====

${data.output || ''}
${data.error ? "\nErrors:\n" + data.error : ''}
            `;
            logElement.textContent += '\n' + logs;
            terminalWrapper.style.display = 'block';
            terminalWrapper.scrollTop = terminalWrapper.scrollHeight;

            M.toast({ html: 'Git commit and push done!', classes: 'green darken-2' });
        })
        .catch(error => {
            console.error('Git commit error:', error);
            M.toast({ html: 'Failed to commit changes', classes: 'red darken-1' });
        })
        .finally(() => {
            newBtn.disabled = false;
        });
    });
}
document.addEventListener('DOMContentLoaded', function() {
    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
    console.log("Modals initialized on page load");
});

function openGitAddModal() {
    console.log("Opening Git Add modal...");

    fetch('/api/git-changes')
    .then(res => res.json())
    .then(data => {
        const fileList = data.files || [];
        const form = document.getElementById('git-file-list');
        form.innerHTML = '';

        fileList.forEach(file => {
            const id = 'file_' + btoa(file).replace(/=/g, '');
            form.innerHTML += `
                <p>
                    <label>
                        <input type="checkbox" id="${id}" class="filled-in file-check" value="${file}"/>
                        <span>${file}</span>
                    </label>
                </p>`;
        });
        document.getElementById('git-commit-msg').value = '';

        const modalEl = document.getElementById('git-add-modal');
        let instance = M.Modal.getInstance(modalEl);
        if (!instance) instance = M.Modal.init(modalEl);
        instance.open();
        document.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'git-commit-btn') {
                const selectedFiles = [...document.querySelectorAll('.file-check:checked')].map(input => input.value);
                const message = document.getElementById('git-commit-msg').value.trim();

                const commitBtn = document.getElementById('git-commit-btn');
                commitBtn.disabled = true;
                commitBtn.innerText = "Pushing...";

                // 🔹 Log the selected files to the browser console
                console.log("Selected files to commit:", selectedFiles);
                console.log("Commit message:", message);
        
                if (!selectedFiles.length) {
                    M.toast({ html: 'Select files to commit!', classes: 'red darken-2' });
                    return;
                }
                if (!message) {
                    M.toast({ html: 'Enter a commit message!', classes: 'red darken-2' });
                    return;
                }
                const logElement = document.getElementById("git-log-output");
                const terminalWrapper = document.getElementById("terminal-wrapper");
            
                logElement.textContent += `\n==== Staging Files ====\n${selectedFiles.join('\n')}\n`;
                terminalWrapper.style.display = 'block';
                terminalWrapper.scrollTop = terminalWrapper.scrollHeight;
        
               // Step 1: Add files
                fetch('/api/git-add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({files: selectedFiles})
                })
                .then(res => res.json())
                .then(addData => {
                    logElement.textContent += `\n==== Git Add ====\n${addData.output || ''}${addData.error || ''}\n`;
                    terminalWrapper.style.display = 'block';
                    terminalWrapper.scrollTop = terminalWrapper.scrollHeight;

                    // Step 2: Commit and push
                    return fetch('/api/git-commit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message })
                    });
                })
                .then(res => res.json())
                .then(data => {
                    logElement.textContent += `${data.output || ''}`;
                    terminalWrapper.style.display = 'block';
                    terminalWrapper.scrollTop = terminalWrapper.scrollHeight;

        
                    M.toast({ html: 'Committed and pushed!', classes: 'green darken-2' });
                    let modal = M.Modal.getInstance(document.getElementById('git-add-modal'));
                    if (modal) modal.close();
                })
                .catch(err => {
                    console.error("Commit error:", err);
                    M.toast({ html: 'Git commit failed!', classes: 'red darken-2' });
                })
                .finally(() => {
                    commitBtn.disabled = false;
                    commitBtn.innerText = "Commit & Push";
                });
            }
        });
        
    });
}


//git terminal
function toggleTerminal() {
    const terminal = document.getElementById('terminal-wrapper');
    const icon = document.getElementById('terminal-toggle-icon');

    const isHidden = terminal.style.display === 'none';
    terminal.style.display = isHidden ? 'block' : 'none';

    // Toggle Font Awesome icon
    icon.className = isHidden
        ? 'fa-solid fa-caret-down'
        : 'fa-solid fa-caret-up';
}

// //execute terminal
// let eventSource;

// function startLogStream() {
// // Prevent duplicate connections
//     if (eventSource) return;

//     eventSource = new EventSource('/stream_logs');

//     const logOutput = document.getElementById('log-output');
//     const logContainer = document.getElementById('log-container');

//     eventSource.onmessage = function(e) {
//         logOutput.textContent += e.data + '\n';
//         // Auto-scroll to the bottom
//         logOutput.scrollTop = logOutput.scrollHeight;
//         logContainer.style.display = 'block';
//     };

//     eventSource.onerror = function(err) {
//         console.error("Stream error:", err);
//         eventSource.close();
//         eventSource = null;
//     };
// }

function toggleLogTerminal() {
    const logContainer = document.getElementById('log-container');
    const icon = document.getElementById('log-toggle-icon');

    const isVisible = logContainer.style.display === 'block';
    logContainer.style.display = isVisible ? 'none' : 'block';
    icon.className = isVisible ? 'fa-solid fa-caret-up' : 'fa-solid fa-caret-down';
}



//restart app
function restartApp() {
    const statusDiv = document.getElementById("status");

    fetch('/restart', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            let seconds = data.countdown || 5;

            const interval = setInterval(() => {
                statusDiv.innerHTML = `<b>Restarting app in ${seconds} second(s)...</b>`;
                seconds--;

                if (seconds < 0) {
                    clearInterval(interval);
                    statusDiv.innerHTML = `<b>Refreshing...</b>`;
                    location.reload();  // ⬅️ Reload the page
                }
            }, 1000);
        })
        .catch(error => {
            console.error('Error:', error);
            statusDiv.innerHTML = `<span style="color:red;"><b>Error restarting app.</b></span>`;
        });
}


// function openMonacoEditor(filePath) {
//     fetch(`/api/get-feature-content?file=${encodeURIComponent(filePath)}`)
//         console.log("filepath:", filePath)
//         .then(response => response.text())
//         .then(content => {
//             const modal = document.getElementById('editor-modal');
//             const modalInstance = M.Modal.getInstance(modal);
//             modalInstance.open();

//             require(["vs/editor/editor.main"], function () {
//                 if (monacoEditorInstance) {
//                     monacoEditorInstance.dispose();
//                 }

//                 monacoEditorInstance = monaco.editor.create(document.getElementById("monaco-editor"), {
//                     value: content,
//                     language: "gherkin", // or "plaintext"
//                     theme: "vs-dark",
//                     readOnly: true,
//                 });
//             });
//         })
//         .catch(error => console.error("Failed to load file content:", error));
// }

let monacoInstance = null;

function openMonacoEditor_features(fileName) {
    const editorContainer = document.getElementById("monaco-editor");
    editorContainer.innerHTML = '<div class="progress"><div class="indeterminate"></div></div>';

    console.log("Sending file name:", fileName);

    fetch("/api/get-feature-content", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ file_name: fileName }),
    })
    .then(async response => {
        const text = await response.text();
        console.log("Raw response:", text);
        try {
            const json = JSON.parse(text);
            const content = json.content || "";

            // Open modal first
            const modal = M.Modal.getInstance(document.getElementById("editor-modal"));
            modal.open();

            // Delay to ensure modal is visible before Monaco loads
            setTimeout(() => {
                require(["vs/editor/editor.main"], function () {
                    // Clear previous content
                    editorContainer.innerHTML = "";

                    monaco.editor.create(editorContainer, {
                        value: content,
                        language: "gherkin",
                        theme: "vs-dark",
                        automaticLayout: true,
                        readOnly: false,
                        padding: {
                            top: 20,
                            bottom: 20
                        }
                    });
                    
                });
            }, 400);

        } catch (e) {
            console.error("Failed to parse JSON:", e);
            editorContainer.innerText = "Error loading file content.";
        }
    })
    .catch(error => {
        console.error("Network error:", error);
        editorContainer.innerText = "Error loading file content.";
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
});

// function openMonacoEditor(fileName) {
//     const editorContainer = document.getElementById("monaco-editor");
//     editorContainer.innerHTML = '<div class="progress"><div class="indeterminate"></div></div>';

//     console.log("Sending file name:", fileName);

//     fetch("/api/get-step-content", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ file_name: fileName }),
//     })
//     .then(async response => {
//         const text = await response.text();
//         console.log("Raw response:", text);
//         try {
//             const json = JSON.parse(text);
//             const content = json.content || "";

//             // Open modal first
//             const modal = M.Modal.getInstance(document.getElementById("editor-modal"));
//             modal.open();

//             // Delay to ensure modal is visible before Monaco loads
//             setTimeout(() => {
//                 require(["vs/editor/editor.main"], function () {
//                     // Clear previous content
//                     editorContainer.innerHTML = "";

//                     monaco.editor.create(editorContainer, {
//                         value: content,
//                         language: "python",
//                         theme: "vs-dark",
//                         automaticLayout: true,
//                         readOnly: false,
//                         padding: {
//                             top: 20,
//                             bottom: 20
//                         }
//                     });
                    
//                 });
//             }, 400);

//         } catch (e) {
//             console.error("Failed to parse JSON:", e);
//             editorContainer.innerText = "Error loading file content.";
//         }
//     })
//     .catch(error => {
//         console.error("Network error:", error);
//         editorContainer.innerText = "Error loading file content.";
//     });
// }


// document.addEventListener("DOMContentLoaded", function () {
//     const modals = document.querySelectorAll('.modal');
//     M.Modal.init(modals);
// });

let monacoEditorInstance = null;

function openMonaco() {
    const container = document.getElementById("monaco-container");
    container.innerHTML = '<div class="progress"><div class="indeterminate"></div></div>';

    let gherkinContent = `Feature: ${featureName}\n\n`;

    document.querySelectorAll("#scenario-container .draggable-scenario").forEach(scenarioDiv => {
        let scenarioName = scenarioDiv.querySelector("strong").innerText;
        gherkinContent += `  Scenario: ${scenarioName}\n`;

        let steps = Array.from(scenarioDiv.querySelectorAll(".steps-drop-zone .dropped-item")).map(item => {
            let dropdown = item.querySelector(".step-type-selector");
            let stepText = item.querySelector("span")?.textContent.trim() ?? "";

            let stepWithKeyword = stepText;
            if (dropdown && !stepText.startsWith(dropdown.value)) {
                stepWithKeyword = `${dropdown.value} ${stepText}`;
            }

            stepWithKeyword = stepWithKeyword.replace(/^(\w+)\s*['"]?|['"]$/g, '$1 ').trim();
            return `    ${stepWithKeyword}`;
        });

        steps.forEach(step => {
            gherkinContent += `${step}\n`;
        });

        gherkinContent += `\n`;
    });

    // Show the Monaco modal
    const modalInstance = M.Modal.getInstance(document.getElementById("monaco-modal"));
    modalInstance.open();

    // Delay rendering slightly to ensure modal is visible
    setTimeout(() => {
        require(['vs/editor/editor.main'], function () {
  

            if (monacoEditorInstance) {
                monacoEditorInstance.setValue(gherkinContent);
            } else {
                monacoEditorInstance = monaco.editor.create(container, {
                    value: gherkinContent,
                    language: "gherkin",
                    theme: "vs-dark",
                    readOnly: true,
                    automaticLayout: true
                });
            }
        });
    }, 400);
}
document.addEventListener("DOMContentLoaded", function () {
    const modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
});

// function openMonacoEditorFromText(content) {
//     // Assuming you already initialized the Monaco editor like:
//     // monaco.editor.create(...)

//     if (window.monacoEditorInstance) {
//         window.monacoEditorInstance.setValue(content);
//     } else {
//         // You can initialize Monaco here if not already done
//         require(['vs/editor/editor.main'], function () {
//             window.monacoEditorInstance = monaco.editor.create(document.getElementById("monaco-container"), {
//                 value: content,
//                 language: 'gherkin',
//                 theme: 'vs-dark',
//                 automaticLayout: true
//             });
//         });
//     }

//     // Show the Monaco container/modal if it's hidden
//     document.getElementById("monaco-container").style.display = "block";
// }

// function find_report(folderName) {
//     fetch("/get-report", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ folder: folderName }),
//     })
//     .then(response => response.json())
//     .then(data => {
//         const statusDiv = document.getElementById("report-status");
//         const reportFrame = document.getElementById("report-frame");

//         statusDiv.textContent = data.message;

//         if (data.message === "BAT file found") {
//             reportFrame.src = `/report/${folderName}`;
//             reportFrame.style.display = "block";
//         } else {
//             reportFrame.src = "";
//             reportFrame.style.display = "none";
//         }
//     })
//     .catch(error => {
//         console.error("Error:", error);
//     });
// }

function find_report(folderName) {
    // Fetch the contents of the folder when it is clicked
    fetch("/display_report", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ folder_name: folderName }),  // Send the folder name to the backend
    })
    .then(response => response.json())
    .then(data => {
        // Once the HTML is rendered, inject it into the view-report-wrapper div
        const viewReportWrapper = document.getElementById("view-report-wrapper");
        viewReportWrapper.innerHTML = data.html;  // Inject the updated report content here
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
