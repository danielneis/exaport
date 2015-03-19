
window.jQueryExaport = jQuery.noConflict(true);

(function($){
	$.empty = function(obj) {
		if (!obj) {
			return true;
		}

		for ( key in obj) {
			return false;
		}
		return true;
	};

	window.ExabisEportfolio = $E = {};

	
	$.extend($E, {
		courseid: 1,

		translations: null,

		translate: function(key)
		{
			if (this.translations[key] == undefined) {
				return '[[js['+key+']js]]';
			} else {
				return this.translations[key];
			}
		},

		setTranslations: function(translations) {
			this.translations = translations;
		},

		userlist_loaded: false,
		load_userlist: function(type)
		{
			if (this.userlist_loaded) {
				return;
			}
			this.userlist_loaded = true;

			$('#sharing-userlist').html('loading userlist...');

			$.getJSON(document.location.href, {action: 'userlist'}, function(courses){
				var html = '';

				if (!$.empty(courses)) {
					$.each(courses, function(tmp, course){
						html += '<fieldset class="course-group"><legend class="course-group-title">' +
								($E.courseid == course.id ? '<b>' : '') +
								course.fullname +
								($E.courseid == course.id ? '</b>' : '') +
								'</legend>';

						html += '<div class="course-group-content">';
						if (!$.empty(course.users)) {
							html += "<table width=\"70%\">";
							html += "<tr><th align=\"center\">&nbsp;</th>";
							if (type == 'views_mod') html += "<th align=\"center\">&nbsp;</th>";
							html += "<th align=\"left\">"+$E.translate('name')+"</th><th align=\"right\">"+$E.translate('role')+"</th></tr>";

							html += '<tr><td align=\"center\" width="5%">';
							html += '<input class="shareusers-check-all" courseid="'+course.id+'" type="checkbox" />';
							html += "<br />"+$E.translate('checkall');
							html += "</td></tr>";

							$.each(course.users, function(tmp, user){
								html += '<tr><td align=\"center\" width="5%">';
								html += '<input class="shareusers" type="checkbox" courseid="'+course.id+'" name="shareusers['+user.id+']" value="'+user.id+'"' +
									(user.shared_to ? ' checked="checked"' : '') +
									' />';
								if (type == 'views_mod') {
									html += "<br />"+$E.translate('sharejs');
									html += '</td><td align=\"center\" width="5%" style="padding-right: 20px;">';
									html += '<input class="notifyusers" type="checkbox" disabled="disabled" name="notifyusers['+user.id+']" value="'+user.id+'" />';
									html += "<br />"+$E.translate('notify');
								}
								html += "</td><td align=\"center\" width='45%'>" + user.name + "</td><td align=\"center\" width='45%'>" + user.rolename + "</td></tr>";
							});

							html += "</table>";
						} else {
							html += $E.translate('nousersfound');
						}
						html += '</div>';
						html += "</fieldset>";
					});
				} else {
					html += '<b>'+$E.translate('nousersfound')+'</b>';
				}

				$('#sharing-userlist').html(html);
				
				// set default checkboxes for category
				if (sharedusersarr.length > 0) {
					$.each(sharedusersarr, function(tmp, userid){
						$('#mform1 #internaccess-users input:checkbox[value='+userid+']').attr("checked", true);
					})
				}

				$('#sharing-userlist .shareusers-check-all').click(function(){
					// check/uncheck all users in this course
					$('#sharing-userlist .shareusers:checkbox[courseid='+$(this).attr('courseid')+']')
						.prop('checked', $(this).is(':checked'))
						// execute click handler
						.each(function(){
							// wrapped in each, because triggerHandler only works on first element
							$(this).triggerHandler('click');
						});
				});
				/*
				$('#sharing-userlist .shareusers:checkbox, #sharing-userlist .notifyusers:checkbox').click(function(){
					// check/uncheck this user in other courses
					$('#sharing-userlist :checkbox[name="'+this.name+'"]').attr('checked', this.checked);
				});
				*/

                // stop slow loading
				$('#sharing-userlist .shareusers:checkbox').click(function(){
					// enable/disable notifyuser, according to shared users checkbox
					var $notifyboxes = $(this).closest('tr').find('.notifyusers');

					$notifyboxes.attr('disabled', !this.checked);
					if (!this.checked) {
						$notifyboxes.prop('checked', false);
					}
					
					// check/uncheck all users
					var $courseCheckboxes = $('#sharing-userlist .shareusers:checkbox[courseid='+$(this).attr('courseid')+']');
					$('#sharing-userlist .shareusers-check-all[courseid='+$(this).attr('courseid')+']').prop('checked', $courseCheckboxes.not(':checked').length == 0);
				});
                $('.course-group-content').each(function(){
                    var flag = 0;
                    $(this).find( 'table > tbody > tr > td > input.shareusers').each(function(){
                        if (flag==1)
                            return false;
                        if ($(this).prop('checked')==false)
                            flag = 1;

                        var $notifyboxes = $(this).closest('tr').find('.notifyusers');
                        $notifyboxes.attr('disabled', !this.checked);
                        if (!this.checked) {
                            $notifyboxes.prop('checked', false);
                        }
                    });
                    if (flag == 0) {
                        $(this).find('table > tbody > tr > td > input.shareusers-check-all').prop('checked', true);
                    }
                });

				// open/close course group
				$('.course-group-title').on('click', function(){
					$(this).closest('.course-group').toggleClass('course-group-open');
				});
				// open all shared courses
				$('.course-group').has('input:checked').addClass('course-group-open');
			});
		},

		grouplist_loaded: false,
		load_grouplist: function(type)
		{
			if (this.grouplist_loaded) {
				return;
			}
			this.grouplist_loaded = true;

			$('#sharing-grouplist').html('loading grouplist...');

			$.getJSON(document.location.href, {action: 'grouplist'}, function(courses){
				var html = '';

				if (!$.empty(courses)) {
					$.each(courses, function(tmp, course){
						html += '<fieldset class="course-group"><legend class="course-group-title">' +
								($E.courseid == course.id ? '<b>' : '') +
								course.fullname +
								($E.courseid == course.id ? '</b>' : '') +
								'</legend>';

						html += '<div class="course-group-content">';
						if (!$.empty(course.groups)) {
							html += "<table width=\"70%\">";
							html += "<tr><th align=\"center\">&nbsp;</th>";
							if (type == 'views_mod') html += "<th align=\"center\">&nbsp;</th>";
							html += "<th align=\"left\">"+$E.translate('grouptitle')+"</th><th align=\"right\">"+$E.translate('membersnumber')+"</th></tr>";

							html += '<tr><td align=\"center\" width="5%">';
							html += '<input class="sharegroups-check-all" courseid="'+course.id+'" type="checkbox" />';
							html += "<br />"+$E.translate('checkall');
							html += "</td></tr>";

							$.each(course.groups, function(tmp, group){
								html += '<tr><td align=\"center\" width="5%">';
								html += '<input class="sharegroups" type="checkbox" courseid="'+course.id+'" name="sharegroups['+group.id+']" value="'+group.id+'"' +
									(group.shared_to ? ' checked="checked"' : '') +
									' />';
/*								if (type == 'views_mod') {
									html += "<br />"+$E.translate('sharejs');
									html += '</td><td align=\"center\" width="5%" style="padding-right: 20px;">';
									html += '<input class="notifyusers" type="checkbox" disabled="disabled" name="notifyusers['+user.id+']" value="'+user.id+'" />';
									html += "<br />"+$E.translate('notify');
								} */
								html += "</td><td align=\"center\" width='45%'>" + group.title + "</td><td align=\"center\" width='45%'>" + group.members + "</td></tr>";
							});

							html += "</table>";
						} else {
							html += $E.translate('nogroupsfound');
						}
						html += '</div>';
						html += "</fieldset>";
					});
				} else {
					html += '<b>'+$E.translate('nogroupsfound')+'</b>';
				}

				$('#sharing-grouplist').html(html);

				// set default checkboxes for category
				if (sharedgroupsarr.length > 0) {
					$.each(sharedgroupsarr, function(tmp, groupid){
						$('#mform1 #internaccess-groups input:checkbox[value='+groupid+']').attr("checked", true);
					})
				}

				
				$('#sharing-grouplist .sharegroups-check-all').click(function(){
					// check/uncheck all groups in this course
					$('#sharing-grouplist .sharegroups:checkbox[courseid='+$(this).attr('courseid')+']')
						.prop('checked', $(this).is(':checked'))
						// execute click handler
						.each(function(){
							// wrapped in each, because triggerHandler only works on first element
							$(this).triggerHandler('click');
						});
				});

                // stop slow loading
				$('#sharing-grouplist .sharegroups:checkbox').click(function(){
					// enable/disable notifyuser, according to shared groups checkbox
/*					var $notifyboxes = $(this).closest('tr').find('.notifyusers');

					$notifyboxes.attr('disabled', !this.checked);
					if (!this.checked) {
						$notifyboxes.prop('checked', false);
					}/**/
					
					// check/uncheck all groups
					var $courseCheckboxes = $('#sharing-grouplist .sharegroups:checkbox[courseid='+$(this).attr('courseid')+']');
					$('#sharing-grouplist .sharegroups-check-all[courseid='+$(this).attr('courseid')+']').prop('checked', $courseCheckboxes.not(':checked').length == 0);
				});
                $('.course-group-content').each(function(){
                    var flag = 0;
                    $(this).find( 'table > tbody > tr > td > input.sharegroups').each(function(){
                        if (flag==1)
                            return false;
                        if ($(this).prop('checked')==false)
                            flag = 1;

/*                        var $notifyboxes = $(this).closest('tr').find('.notifyusers');
                        $notifyboxes.attr('disabled', !this.checked);
                        if (!this.checked) {
                            $notifyboxes.prop('checked', false);
                        }/**/
                    });
                    if (flag == 0) {
                        $(this).find('table > tbody > tr > td > input.sharegroups-check-all').prop('checked', true);
                    }
                });

				// open/close course group
				$('.course-group-title').on('click', function(){
					$(this).closest('.course-group').toggleClass('course-group-open');
				});
				// open all shared courses
				$('.course-group').has('input:checked').addClass('course-group-open');
			});
		}

	});

	$(function(){
		if ($('body').attr('class').match(/course-([^\s]+)/)) {
			$E.courseid = RegExp.$1;
		}
	});
	
})(jQueryExaport);
