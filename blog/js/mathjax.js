marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

var Preview = {
    delay: 50,        // delay after keystroke before updating
    preview: null,     // filled in by Init below
    buffer: null,      // filled in by Init below
    timeout: null,     // store setTimout id
    mjRunning: false,  // true when MathJax is processing

    //  Get the preview and buffer DIV's
    Init: function () {
        this.preview = document.getElementById("blog-preview");
        this.buffer = document.getElementById("blog-buffer");

        this.callback = MathJax.Callback(["CreatePreview", Preview]);
        this.callback.autoReset = true;
    },
    //  Switch the buffer and preview, and display the right one.
    //  (We use visibility:hidden rather than display:none since
    //  the results of running MathJax are more accurate that way.)
    //
    SwapBuffers: function () {
        var buffer = this.preview;
        var preview = this.buffer;
        this.buffer = buffer;
        this.preview = preview;
        buffer.style.display = "none";
        buffer.style.position = "absolute";
        preview.style.position = ""; 
        preview.style.display = "";
    },
    //
    //  This gets called when a key is pressed in the textarea.
    //  We check if there is already a pending update and clear it if so.
    //  Then set up an update to occur after a small delay (so if more keys
    //    are pressed, the update won't occur until after there has been 
    //    a pause in the typing).
    //  The callback function is set up below, after the Preview object is set up.
    // 
    Update: function (text) {
        this.buffer.innerHTML = this.Escape(text);
        if (this.timeout) {clearTimeout(this.timeout)}
        this.timeout = setTimeout(this.callback,this.delay);
    },
    //
    //  Creates the preview and runs MathJax on it.
    //  If MathJax is already trying to render the code, return
    //  If the text hasn't changed, return
    //  Otherwise, indicate that MathJax is running, and start the
    //    typesetting.  After it is done, call PreviewDone.
    //  
    CreatePreview: function () {
        Preview.timeout = null;
        if (this.mjRunning) return;
        this.mjRunning = true;
        MathJax.Hub.Queue(
            ["Typeset", MathJax.Hub, this.buffer],
            ["PreviewDone", this],
            ["resetEquationNumbers", MathJax.InputJax.TeX]
        );
    },
    //
    //  Indicate that MathJax is no longer running,
    //  do markdown over MathJax's result, 
    //  and swap the buffers to show the results.
    //
    PreviewDone: function () {
        this.mjRunning = false;
        var text = this.buffer.innerHTML;
        // replace occurrences of &gt; at the beginning of a new line
        // with > again, so Markdown blockquotes are handled correctly
        text = text.replace(/^&gt;/mg, '>');
        this.buffer.innerHTML = marked(text);
        this.SwapBuffers();
    },
    Escape: function (html, encode) {
        return html
            .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },
};
//
//  Cache a callback to the CreatePreview action
//
