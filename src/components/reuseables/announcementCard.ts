import { marked } from "marked";
import { FeedbackTypesArray } from "../../core/lib/enum";

export const announcementCard = (feed: any, primaryColor: string, isDarkMode: boolean) => {
    const { name, updated_at, is_new, description, id } = feed;
    const htmlDescription = marked(description);

    const cardBorderColor = isDarkMode ? "1px solid #52526FBF" : "1px solid #E2E8F0";
    const cardBgColor = isDarkMode ? "#25263061" : "transparent";
    const titleColor = isDarkMode ? "#D2D3E0" : "#303540";
    const descriptionColor = isDarkMode ? "#858699" : "#303540CC";
    const newChipColor = isDarkMode ? "#FFFFFFD9" : "#1F2026";
    const newChipTextColor = isDarkMode ? "#1F2026" : "#F8F9FA";

    const fieldBg = isDarkMode ? "#222429" : "#FFFFFF";
    const fieldTextColor = isDarkMode ? "#FAFAFA" : "#303540";
    const fieldBorder = isDarkMode ? "1px solid #52526F40" : "1px solid #E5E7EB";

    return `
    <div
        style="
            background-color:${cardBgColor};
            border:${cardBorderColor};
            padding:20px;
            display:flex;
            flex-direction:column;
            gap:10px;
            border-radius: 6px;
        "
        data-id="${id}" 
        class="announcement-card"
    >
    <div
        style="
            display:grid;
            grid-template-columns: ${is_new ? "10fr 2fr" : "12fr"};
            gap:10px;
            align-items:start;
        "
    >


        <div style="display:flex;gap:5px;flex-direction:column;">
            <h3 style="color:${titleColor};font-size:16px;font-weight:700; line-height: 1.4;">${name}</h3>
            <span style="color:${descriptionColor};font-size:10px;">${updated_at}</span>
        </div>
    
    
        <div
            style="
                display:${is_new ? "flex" : "none"};
                justify-content:end;
            "
        >
            <span 
                style="
                    background-color:${newChipColor};
                    width:max-content;
                    padding:6px 6px 3px 6px ;
                    border-radius:5px;
                    color:${newChipTextColor};
                    font-size:10px;
                "
            >
                NEW
            </span>
        </div>

    </div>

        
        <span id="oppla-ai-announcement-description" style="color:${descriptionColor}">${htmlDescription}</span>
        
        <button class="toggle-comment-box" style="padding: 6px 10px; font-size: 14px; border: none; background-color: ${primaryColor}; color: white; border-radius: 5px; width: max-content; cursor: pointer;">
            Leave a comment
        </button>

        <div class="comment-box" style="display: none; flex-direction: column; gap: 20px;">
            <select class="oppla-ai-announcement-comment-type" style="height:30px;padding: 6px 8px;font-size:12px; border-radius: 5px; background: ${fieldBg}; color: ${fieldTextColor}; border:${fieldBorder};">
                ${FeedbackTypesArray.map((option: any) => (
        `<option value="${option?.value}">${option?.label}</option>`
    )).join("")}
            </select>
            <input type="text" class="oppla-ai-announcement-comment-title" placeholder="Add a comment..." style="padding: 6px 8px;font-size:12px; border-radius: 5px; background: ${fieldBg}; color: ${fieldTextColor};border:${fieldBorder};" />
            <div style="display: flex; gap: 10px;">
                <button class="oppla-ai-announcement-comment-submit" style="padding: 5px 20px; background-color: ${primaryColor}; color: white; border: none; border-radius: 5px; font-size: 14px; cursor: pointer;">Submit</button>
                <button class="cancel-comment" style="padding: 5px 20px; background-color: #ccc; color: black; border: none; border-radius: 5px; font-size: 14px; cursor: pointer;">Cancel</button>
            </div>
        </div>
    </div>
    `;
};
