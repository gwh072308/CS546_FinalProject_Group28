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

            var html = "<ul class='comment-list'>";

            data.comments.forEach(function (c) {
                html += `
                    <li class="comment-item">
                        <strong>${c.username || "User"}:</strong>
                        <p>${c.text}</p>
                        <small>${new Date(c.createdAt).toLocaleString()}</small>
                        ${String(c.userId) === userId ?
                        `<button class="delete-btn" data-id="${c._id}">Delete</button>`
                        : ""}
                    </li>
                `;
            });

            html += "</ul>";
            container.html(html);
        });
    }

    $('#comments-area').on('click', '.delete-btn', function (event) {
        event.preventDefault();

        var button = $(this);
        var commentId = button.data('id');
        var userId = $('#userId').val();

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

        var arrestId = $('#arrestId').val();
        var userId = $('#userId').val();
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