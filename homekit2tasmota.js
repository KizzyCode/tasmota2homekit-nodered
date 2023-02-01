/**
 * Translates a HomeKit power outlet state into a Tasmota compatible state
 * @param {*} msg The message to translate
 */
function power_outlet(msg) {
    // Create a new payload
    const translated = { /* no fields yet */ };

    // Translate state if any
    if (msg.payload.hasOwnProperty("On")) {
        translated["cmnd"] = msg.payload["On"] ? "POWER ON" : "POWER OFF";
    }
    
    // Return the new payload
    return { payload: translated };
}


module.exports = function(RED) {
    function homekit2tasmota(config) {
        // Create the node
        RED.nodes.createNode(this, config);
        
        // Register the on-"input"-handler
        this.on("input", function(msg, send, done) {
            try {
                // The translator functions for the different device kinds
                const translators = {
                    "Power Outlet": power_outlet
                };

                // Select the appropriate mapper
                const selected = translators[config.kind];
                if (selected === undefined) {
                    throw "Invalid device kind: " + config.kind;
                }

                // Call the appropriate mapper and finish the flow
                const result = selected(msg);
                send(result);
                done();
            } catch (e) {
                // Propagate error to node red
                done(e);
            }
        });
    }
    RED.nodes.registerType("homekit to tasmota", homekit2tasmota);
}
