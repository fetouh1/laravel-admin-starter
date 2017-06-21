function getHeaderNotifications()
{
    function getHeaderActions()
    {
        doAjax('/api/notifications/actions/latest', null, function (response)
        {
            renderActions(response);
        });

        function renderActions(response)
        {
            if (!(response.success || response.data)) {
                return false;
            }

            var items = response['data'];
            if (items.length > 0) {
                $('#js-actions-badge').show();
                $('#js-actions-badge').html(items.length);

            } else {
                $('#js-actions-badge').hide();
                $('#js-actions-list').html('<li><a><p style="margin-left: 0px; text-align: center">There are no actions</p></a></li>');
                return false;
            }

            $('#js-actions-list').html('');
            for (var i = 0; i < items.length; i++) {
                var item = items[i];

                var html = '<li><a href="#"><p style="margin-left: 0px; color: #444">';
                html += item['title'];
                html += '<small class="pull-right"><i class="fa fa-clock-o"></i> ';
                html += item['created_at'];
                html += '</small></p><p style="margin-left: 0px;">';
                html += item['message'];
                html += '</p></a></li>';

                $('#js-actions-list').append(html);
            }
        }
    }

    function getUnreadNotifications(userId)
    {
        doAjax('/api/notifications/' + userId + '/unread', null, function (response)
        {
            renderNotificationsTable(response);
        });
    }

    function renderNotificationsTable(response)
    {
        // no need to 'update credit or hide spinner)
        // if it failed - just ignore as it will call again
        if (!(response.success || response.data)) {
            return false;
        }

        var items = response['data'];
        if (items.length > 0) {
            $('#js-notifications-badge').show();
            $('#js-notifications-badge').html(items.length);

        } else {
            $('#js-notifications-badge').hide();
            $('#tbl-notifications').find('tbody').html('<tr><td colspan="3" class="text-center">There are currently no notices</td></tr>');
            return false;
        }

        $('#tbl-notifications').find('tbody').html('');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            var html = '<tr><td>' + item['created_at'] + '</td>';
            html += '<td>' + item['message'] + '</td>';
            html += '<td><a data-user="' + item['user_id'] + '" data-id="' + item['id'] + '" class="btn btn-xs btn-primary btn-notification-read">Read</a></td></tr>';

            $('#tbl-notifications').find('tbody').append(html);
        }

        registerNotificationRead();
    }

    function registerNotificationRead()
    {
        $('.btn-notification-read').off('click');
        $('.btn-notification-read').on('click', function (e)
        {
            e.preventDefault();
            BUTTON.loading($(this));

            var userId = $(this).attr('data-user');
            var id = $(this).attr('data-id');
            doAjax('/api/notifications/' + userId + '/read/' + id, null, function (response)
            {
                renderNotificationsTable(response);
            });
        });
    }

    getHeaderActions();
    getUnreadNotifications($('#js-notifications-badge').attr('data-user'));
}
