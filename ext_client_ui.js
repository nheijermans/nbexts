/*
    Add this file to $(ipython locate)/nbextensions/ext_client_ui.js
    And load it with:
    IPython.load_extensions("ext_client_ui");
*/

define([
    "jquery",
    "base/js/namespace",
    'notebook/js/cell',
    'notebook/js/codecell',
], function (
    $,
    IPython,
    cell,
    codecell
    ) {
    "use strict";

    /* Updates Notebook UI with messages initiated by clients other than the
     * notebook. New messages are appended to the end of the notebook as new
     * cells.
     */
    var update_ui = function(evt, msg) {
        if (msg.msg_type == 'execute_input') {
            var cell = IPython.notebook.insert_cell_at_bottom('code');
            if (cell) {
                var cell_index = IPython.notebook.ncells() - 1;
                cell.last_msg_id = msg.parent_header.msg_id;
                cell.set_text(msg.content.code);
                cell._handle_execute_reply(msg);
                IPython.notebook.scroll_to_cell(cell_index);
                IPython.notebook.select(cell_index);
            }
        } else {
            /* Find the input cell that corresponds with the output, then add
             * the contents to the cell's output area.
             */
            var count = IPython.notebook.ncells();
            while (count--) {
                var cell = IPython.notebook.get_cell(count);
                if (cell && cell.last_msg_id == msg.parent_header.msg_id) {
                    cell.output_area.handle_output(msg);
                    IPython.notebook.scroll_to_cell(count);
                    IPython.notebook.select(count);
                    break;
                }
            }
        }
    }

    var register_event_handler = function() {
        console.log("Registering for unsolicited message notifications.");
        $([IPython.events]).on("received_unsolicited_message.Kernel", update_ui);
    }

    var load_ipython_extension = function () {
        console.log("Loading extension.");
        register_event_handler();
    };

    return {
        load_ipython_extension : load_ipython_extension,
    };
});
