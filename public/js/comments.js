(function ($) {

    function loadComments() {
        // if there is no arrestId element on this page (like /help, /home), just skip
        var $arrestInput = $('#arrestId');
        if ($arrestInput.length === 0) {
            return;
        }

        var arrestId = $arrestInput.val();
        if (!arrestId) {
            // avoid calling /comments/arrest/undefined
            return;
        }

        $.ajax({
            method: "GET",
            url: '/comments/arrest/' + arrestId,
            dataType: "json"
        }).then(function (data) {
            var container = $('#comments-area');

            if (!data.comments || data.comments.length === 0) {
                container.html("<p>No comments yet. Be the first!</p>");
                return;
            }

            var userId = $('#userId').val();

            var $list = $('<ul>').addClass('comment-list');

            data.comments.forEach(function (c) {
               var $li = $('<li>').addClass('comment-item');
                
                // Prevent XSS
                $li.append($('<strong>').text((c.username || "User") + ":"));
                $li.append($('<p>').text(c.text));  
                $li.append($('<small>').text(new Date(c.createdAt).toLocaleString()));
                
                if (String(c.userId) === userId) {
                    var $btn = $('<button>')
                        .addClass('delete-btn')
                        .attr('data-id', c._id)  
                        .text('Delete');
                    $li.append($btn);
                }
                
                $list.append($li);
            });

            container.html($list);
        }).fail(function (xhr, status, error) {
            console.error('Error loading comments:', error);
            container.html("<p style='color: red;'>Error loading comments. Please refresh the page.</p>");
        });
    }

    $('#comments-area').on('click', '.delete-btn', function (event) {
        event.preventDefault();

        var button = $(this);
        var commentId = button.data('id');
        var userId = $('#commentUserId').val() || $('#userId').val();

        $.ajax({
            method: "DELETE",
            url: '/comments/' + commentId,
            contentType: 'application/json',
            data: JSON.stringify({ userId: userId })
        }).then(function () {
            loadComments();
        });
    });

    $('#comment-form').on('submit', function (event) {
        event.preventDefault();

        var arrestId = $('#commentArrestId').val();
        var userId = $('#commentUserId').val();
        var content = $('#comment-text').val();

        $.ajax({
            method: "POST",
            url: '/comments',
            contentType: 'application/json',
            data: JSON.stringify({
                arrestId: arrestId,
                userId: userId,
                content: content
            })
        }).then(function () {
            $('#comment-text').val("");
            loadComments();
        });
    });

    $(document).ready(function () {
        loadComments();
    });

})(jQuery);