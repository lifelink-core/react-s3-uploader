"use strict";

var React = require('react'),
    S3Upload = require('./s3upload.js'),
    objectAssign = require('object-assign'),
    ReactDOM = require('react-dom');

var ReactS3Uploader = React.createClass({

    propTypes: {
        baseUrl: React.PropTypes.string.isRequired,
        signingUrl: React.PropTypes.string.isRequired,
        onProgress: React.PropTypes.func,
        onFinish: React.PropTypes.func,
        onError: React.PropTypes.func,
        signingUrlHeaders: React.PropTypes.object.isRequired,
        signingUrlQueryParams: React.PropTypes.object.isRequired,
        uploadRequestHeaders: React.PropTypes.object,
        contentDisposition: React.PropTypes.string.isRequired
    },

    getDefaultProps: function() {
        return {
            onProgress: function(percent, message) {
                console.log('Upload progress: ' + percent + '% ' + message);
            },
            onFinish: function(signResult) {
                console.log("Upload finished: " + signResult.publicUrl)
            },
            onError: function(message) {
                console.log("Upload error: " + message);
            }
        };
    },

    uploadFile: function() {
        new S3Upload({
            fileElement: findDOMNode(this),
            baseUrl: this.props.baseUrl,
            signingUrl: this.props.signingUrl,
            onProgress: this.props.onProgress,
            onFinishS3Put: this.props.onFinish,
            onError: this.props.onError,
            signingUrlHeaders: this.props.signingUrlHeaders,
            signingUrlQueryParams: this.props.signingUrlQueryParams,
            uploadRequestHeaders: this.props.uploadRequestHeaders,
            contentDisposition: this.props.contentDisposition
        });
    },

    clear: function() {
        clearInputFile(findDOMNode(this));
    },

    render: function() {
        return React.DOM.input(objectAssign({}, this.props, {type: 'file', onChange: this.uploadFile}));
    }

});

function findDOMNode(cmp) {
    return ReactDOM.findDOMNode ? ReactDOM.findDOMNode(cmp) : cmp.getDOMNode();
}

// http://stackoverflow.com/a/24608023/194065
function clearInputFile(f){
    if(f.value){
        try{
            f.value = ''; //for IE11, latest Chrome/Firefox/Opera...
        }catch(err){ }
        if(f.value){ //for IE5 ~ IE10
            var form = document.createElement('form'),
                parentNode = f.parentNode, ref = f.nextSibling;
            form.appendChild(f);
            form.reset();
            parentNode.insertBefore(f,ref);
        }
    }
}


module.exports = ReactS3Uploader;
