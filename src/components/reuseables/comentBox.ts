import { SessionStorageName } from "../..";
import { getFromSessionStorage } from "../../core/repositories/Storage";
import { deleteIdeasComment } from "../../core/usecases/deleteIdeasComment";
import { updatedSelectedCardComments } from "../feedbackDetails";
import { renderCloseIcon } from "./closeIcon";
import { generateRandomColors } from "./generateRandomColors";

export const renderCommentBox = (comment: any, primaryColor?: string, isDarkMode?: boolean) => {

    const {
        id,
        issue_id,
        content,
        created_at,
        updated_at,
        user_name,
        user_id
    } = comment


    const { userData } = getFromSessionStorage(SessionStorageName);

    const cardBgColor = isDarkMode ? "#25263061" : "#FFFFFF";
    const cardBorderColor = isDarkMode ? "1px solid #52526FBF" : "1px solid #CFD5DD";

    const commentHeading = isDarkMode ? "#D2D3E0" : "#303540";
    const commentTime = isDarkMode ? "#858699" : "#718096";
    const commentText = isDarkMode ? "#E4E4E4" : "#303540CC";


    return `
    <div 
        style="padding:20px;display:flex;gap:8px; position:relative;background-color:${cardBgColor};border:${cardBorderColor};border-radius:8px;" 
        class="oppla-ai-feedback-card-animate oppla-ai-idea-comment-container" 
        data-comment-id="${id}"
    >
        ${userData?.id === user_id ? `
            <span class="oppla-ai-idea-comment-delete-icon" 
                  style="cursor:pointer;position:absolute;top:10px;right:10px;">
                ${renderCloseIcon({ stroke: isDarkMode ? "#9FA1A7" : "#718096", size: "20" })}
            </span>
        ` : ``}
        
        <div style="display:flex;flex-direction:column;">
            <div style="color:${commentHeading};font-size:12px;display:flex;gap:5px;align-items:center;font-weight:600;">${renderUserIcon({ stroke: commentHeading })} <span>${user_name}</span></div>
            <span style="color:${commentTime};font-size:11px;padding:3px 0 8px 0;"> ${updated_at}</span>
            <span style="color:${commentText};font-size:14px;line-height: 1.6;"> ${content}</span>
        </div>
    </div>
`;

}


// <span style="aspect-ratio:1;display:flex;justify-content:center;align-items:center;
//             width:30px;height:30px;background-color:${generateRandomColors({ string: user_name })};
//             color:white;font-size:14px;border-radius:50px;">
//             ${user_name ? user_name[0] : "A"}
//         </span>

export const handleDeleteIdeasComment = (selectedCard: any, primaryColor: string, isDarkMode: boolean) => {
    document.addEventListener("click", (event: any) => {
        const target = event.target.closest(".oppla-ai-idea-comment-delete-icon");
        if (target) {
            const commentBox = target.closest(".oppla-ai-idea-comment-container");
            if (commentBox) {
                commentBox.remove(); // Remove the comment from the UI
                const commentId = commentBox.getAttribute("data-comment-id"); // Optional: If you have an ID
                deleteIdeasComment({ commentId, issueId: selectedCard?.id })

                updatedSelectedCardComments(selectedCard, "", primaryColor, isDarkMode)
                // console.log(`Comment with ID ${commentId} removed.`);
                // TODO: Call API to delete the comment from the backend if needed
            }
        }
    });
};


const renderUserIcon = ({ stroke = "#fff", size = "20px" }: { stroke?: string; size?: string }) => {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke=${stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-round-icon lucide-circle-user-round"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>
    `
}