IPython Notebook extensions
===========================

ext_client_ui
-------------

This extension adds messages initiated from other clients (e.g. an IPython
console) on the same kernel to the Notebook.

To install it, you'll need to edit files in the directory indicated by running
``ipython locate profile)/static/custom``.

First, add the JavaScript plugin file that implements the Notebook extension.
Then, edit ``custom.js`` to contain something like this:

.. code:: javascript

  require(["base/js/events"], function (events) {
      $([IPython.events]).on("app_initialized.NotebookApp", function () {
          IPython.load_extensions("ext_client_ui");
      });
  });
