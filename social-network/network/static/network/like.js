function like(postId, likeButtonId) {
    likePOST(postId).then(isliked => {
        // If liked successfully
        if (isliked.liked) {

            // Find button on DOM
            let likeButton = document.querySelector(likeButtonId);

            if (likeButton) {
                // Change class to 'Liked' button
                likeButton.className = "btn btn-sm btn-primary";

                // Change event listener to 'unlike'
                likeButton.onclick = () => unlike(postId, likeButtonId);

                // Update like count with an icon
                countLikesGET(postId).then(count => {
                    likeButton.innerHTML = `<i class="bi bi-heart-fill"></i> ${count.likes_count}`;
                });
            }
        }
    });
}

function unlike(postId, likeButtonId) {
    unlikePOST(postId).then(isliked => {
        // If unliked successfully
        if (!isliked.liked) {

            // Find button on DOM
            let likeButton = document.querySelector(likeButtonId);

            if (likeButton) {
                // Change class to 'Like' button
                likeButton.className = "btn btn-sm btn-primary";

                // Change event listener to 'like'
                likeButton.onclick = () => like(postId, likeButtonId);

                // Update like count with an icon
                countLikesGET(postId).then(count => {
                    likeButton.innerHTML = `<i class="bi bi-heart"></i> ${count.likes_count}`;
                });
            }
        }
    });
}
