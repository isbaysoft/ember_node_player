Player.FileUploadView = Ember.TextField.extend({
	type: 'file',
	attributeBindings: ['name'],
	change: function(evt) {
		var self = this;
		var input = evt.target;
		if (input.files && input.files[0]) {
			var reader = new FileReader(),
				file = input.files[0],
				fileName = file.name,
				fileSize = file.size;//,
//				filePath = input.value;
			if (fileSize < 5242880) {
				reader.onload = function(event) {
					var fileToUpload = reader.result;//,
//					    dataURL = event.target.result,
//						mimeType = dataURL.split(",")[0].split(":")[1].split(";")[0],
					var parentController = self.get('controller.parentView').get('controller');
					parentController.set(self.get('name'), fileToUpload);
					parentController.set(self.get('name') + "Name", fileName);
					parentController.set('fileSize', fileSize);
//					parentController.set(self.get('name') + "Type", mimeType);
//					parentController.set('isBase64Enc', fileSize < 800000);
				};
				reader.readAsDataURL(file);
			} else {
				input.value = "";
				alert("File is too big! 5MB max!")
			}
		}
	}
});