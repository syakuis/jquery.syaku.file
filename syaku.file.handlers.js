
function cancelQueue(instance) {
  instance.stopUpload();
  var stats;

do {
  stats = instance.getStats();
  instance.cancelUpload();
} while (stats.files_queued !== 0);

}


var multi_seq = "";

function ProgressBar(instance,file,percent) {
  if (instance.settings.file_upload_multi) {
    jQuery(instance.settings.ele_file + " option[value=" + multi_seq + "]").attr('selected',true);
    jQuery(instance.settings.ele_file + " option[value=" + multi_seq + "]").text("(" + percent + "%) " + file.name);
  } else {
    jQuery(instance.settings.ele_file).val('(' + percent + '%) ' + file.name);
  }
}


// 첨부파일 버튼 누를때 호출
function fileDialogStart() {
}


// 첨부파일 선택 후 호출
function fileQueued(file) {
  try {
    this.setButtonDisabled(true);
  } catch (ex) { this.debug(ex); }

}


function fileDialogComplete(numFilesSelected, numFilesQueued) {
  try {
    this.startUpload();
  } catch (ex) { this.debug(ex); }
}



function uploadStart(file) {
  try {

    if (this.settings.file_upload_multi) {
      multi_seq = "temp_" + jQuery(this.settings.ele_file + " option").length;
      jQuery(this.settings.ele_file).append("<option value='" + multi_seq + "'></option>"); //prepend
    }

  } catch (ex) { this.debug(ex); }

  return true;
}

function uploadProgress(file, bytesLoaded, bytesTotal) {
  try {
    var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
    ProgressBar(this,file,percent);
  } catch (ex) { this.debug(ex); }
}

function uploadSuccess(file, serverData) {
	try {

    var data = xml2json(parseXml(serverData), " ");
    data = eval("(" + data + ")");
    data = data.data.item;

    var error = data.error;
    var message = data.message;
    var file_orl = data.file_orl;
    var filename = data.filename;
    var re_file = data.re_file;
    var folder = data.folder;
    var file_size = data.file_size;
    var extension = data.extension;
    var type = data.type;

    if (error == 'true') {
      this.uploadError(file,0,message);

      if (this.settings.file_upload_multi) {
        jQuery.syakuFileUpload.setDeleteLimit(this,1);
        jQuery(this.settings.ele_file + " option[value=" + multi_seq + "]").remove(); 
      } else {
        jQuery(this.settings.ele_file).val('');
        jQuery(this.settings.ele_file_idx).val('');
      }

    } else {

      var value = "{ file_orl : '" + file_orl + "' , file : '" + filename + "', re_file : '" + re_file + "', folder : '" + folder + "' , file_size : '" + file_size + "' , extension : '" + extension + "' , type : '" + type + "' }";
      var file_size_unit = jQuery.mei.filesize_unit(file_size);

      if (this.settings.file_upload_multi) {
        jQuery(this.settings.ele_file + " option[value=" + multi_seq + "]").text(filename + " (" + file_size_unit + ")"); 
        jQuery(this.settings.ele_file + " option[value=" + multi_seq + "]").attr("value",value);
      } else {
        jQuery(this.settings.ele_file).val(filename + " (" + file_size_unit + ")");
        jQuery(this.settings.ele_file_orl).val(value);
        this.setPostParams(jQuery.extend(this.settings.post_params , { file_orl : file_orl }));
      }

      jQuery.syakuFileUpload.size_sum(this);
    }

	} catch (ex) {
		this.debug(ex);
	}
}

function uploadComplete(file) {

  try {
    if (this.getStats().files_queued === 0) {
      this.setButtonDisabled(false);
//      document.getElementById(this.customSettings.cancelButtonId).disabled = true;
    } else {	
      this.startUpload();
    }
  } catch (ex) { this.debug(ex); }

}


// 첨부파일 선택 후 에러가 발생할 때 호출
function fileQueueError(file, errorCode, message) {
  try {

    switch (errorCode) {

      case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
      alert("업로드 제한 용량을 넘었습니다.");
      break;

      case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
      alert("업로드 할 수 없는 파일입니다.");
      break;

      case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
      alert("업로드 할 수 없는 확장자 파일입니다.");
      break;

      case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
      alert("업로드 할 수 있는 파일 수를 넘었습니다.");
      break;

      default:
      if (file !== null) {
        alert("알 수 없는 오류가 발생하였습니다.");
      }
      break;
    }

  } catch (ex) { this.debug(ex); }
}


function uploadError(file, errorCode, message) {
  try {

    if (this.settings.file_upload_multi) {
      jQuery(this.settings.ele_file + " option[value=" + multi_seq + "]").remove();
    } else {
      jQuery(this.settings.ele_file).val('');
    }

		switch (errorCode) {
      case 0 :
      alert("[업로드 실패]" + message);
      break;
      case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
      alert("[업로드 실패]" + message);
      break;
      case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
      alert("Configuration Error");
      break;
      case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
      alert("업로드 실패");
      break;
      case SWFUpload.UPLOAD_ERROR.IO_ERROR:
      alert("Server (IO) Error");
      break;
      case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
      alert("Security Error");
      break;
      case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
      alert("파일을 찾을 수 없습니다.");
      break;
      /*
      case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
      alert("Upload limit exceeded.");
      break;
      case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
      alert("Failed Validation.  Upload skipped.");
      break;

      case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:

      if (this.getStats().files_queued === 0) {
        document.getElementById(this.customSettings.cancelButtonId).disabled = true;
      }
      alert("Cancelled");
      break;

      case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
      alert("Stopped");
      break;*/

      default:
      alert("Unhandled Error: " + error_code);
      break;
		}

  } catch (ex) { this.debug(ex); }

}