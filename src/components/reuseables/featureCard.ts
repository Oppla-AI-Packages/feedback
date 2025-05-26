import { FeedbackStatus, FeedbackTypes } from "../../core/lib/enum";
import { renderCommentIcn } from "./commentIcon";

export const FeatureCards = (feedback: any, delay: number, usage: string, primaryColor: string, variant: number = 1, isDarkMode: boolean): string => {
  const { title, description, type, votes, status, comments, updated_at } = feedback;

  const descColor = isDarkMode ? "#858699" : "#303540CC";
  const cardBgColor = isDarkMode ? "#25263061" : "#FFFFFF";
  const headingColor = isDarkMode ? "#D2D3E0" : "#303540";
  const cardBorderColor = isDarkMode ? "1px solid #52526F40" : "1px solid #E2E8F0";

  if (variant === 1) {
    return `
      <div
      class="oppla-ai-feedback-card-animate oppla-ai-feedback-card"
      data-feedback='${JSON.stringify(feedback)}'
      style=" 
        border:${cardBorderColor};
        padding: 15px;
        background-color:${usage === "card" ? cardBgColor : "transparent"};
        opacity: 0;
        animation-delay: ${delay * 0.1}s;
        animation-fill-mode: forwards;
        cursor: ${usage === "card" ? "pointer" : "default"};
        border-radius:8px;
      "
    >
      <div style="display: flex; align-items: flex-start; gap: 16px;">
 
            <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
              <div style="display:flex;justify-content:space-between;gap:10px;align-items:start;">
               <div style="display: flex; flex-direction:column;gap:5px;">
                <h3 class=${usage === "card" ? "oppla-ai-feedback-card-title" : "oppla-ai-feedback-card-detail-title"} style="font-weight: 600;font-size:16px; color: ${headingColor}; margin: 0; padding:0; ">
                  ${title}
                </h3>
                <span style="font-size:10px;color:${descColor}">
                  ${updated_at}
                </span>
               </div>
                ${usage === "card" ?
        `
                      <div style="display:flex;gap:4px;align-items:center;color:${headingColor};">
                        ${comments} ${renderCommentIcn({ stroke: headingColor })}
                      </div>
                    `
        :
        ``
      }
              </div>
             
              <span ${usage === "card" ? 'class="oppla-ai-feedback-card-description"' : ''} style="font-size: 15px; color: ${descColor} !important;line-height: 1.5;">
                ${description}
              </span>
            
                <div style="display:flex;gap:15px">
                ${renderTypeChip(type)}
                ${renderStatusChip(status, isDarkMode)}
            </div>
      </div>
    </div>
    `
  }

  if (variant === 2) { 
    return `
    <div
      class="oppla-ai-feedback-card-animate oppla-ai-feedback-card"
      data-feedback='${JSON.stringify(feedback)}'
      style=" 
        padding: 15px;
        background-color:transparent;
        opacity: 0;
        animation-delay: ${delay * 0.1}s;
        animation-fill-mode: forwards;
        cursor: pointer;
        border-radius:8px;
      "
    >
      <div style="display: flex; align-items: flex-start; gap: 16px;">
       
        <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;">
             <div style="display:grid;grid-template-columns: 9fr 3fr;gap:10px;align-items:start;">
                <div style="display: flex; flex-direction:column;gap:5px;">
                <h3 class=${usage === "card" ? "oppla-ai-feedback-card-title" : "oppla-ai-feedback-card-detail-title"} style="font-weight: 500;font-size:16px; color: ${headingColor}; margin: 0; padding:0; ">
                  ${title}
                </h3>
                <span  style="font-size:10px;color:${descColor}">${updated_at}</span>
                </div>
                 <div style="display:flex;justify-content:end;align-items:center;">
                 ${renderTypeChip(type)}
                 </div>
             </div>

             <span class="oppla-ai-feedback-card-description" style="font-size: 15px; color: ${descColor} !important;line-height: 1.5;max-width:100% !important;">
                ${description}
              </span>

         <div style="display: flex;justify-content: start;gap: 12px;">
          <button  style="padding: 5px 20px; background-color: ${primaryColor}; border: none; border-radius: 5px; color: #fff; font-size: 14px; cursor: pointer;">
            Leave a comment
          </button>
         </div>

          <hr style="height:0.2px;border:none; background: ${isDarkMode ? "#313337" : "#31333740"}; margin-top:10px;"/>
          
      </div>
    </div>
    `
  }

  // ${usage === "card" ?
  //   `
  //         <span class="oppla-ai-ideas-card-comment-text" style="color:${primaryColor};display:flex;gap:5px;align-items:center;font-size:14px; font-weight:300;">
  //           ${renderCommentIcn({ stroke: primaryColor })} Add a comment
  //         </span>` : ``}

  return ``

  // ${usage === "card" ?
  //   `
  //             <span class="oppla-ai-ideas-card-comment-text" style="color:${primaryColor};display:flex;gap:5px;align-items:center;font-size:14px; font-weight:300;">
  //               ${renderCommentIcn({ stroke: primaryColor })} Add a comment
  //             </span>` : ``}

  return `
    <div
      class="oppla-ai-feedback-card-animate oppla-ai-feedback-card"
      data-feedback='${JSON.stringify(feedback)}'
      style=" 
        border-bottom: 1px solid #f1f1f1;
        padding: 15px;
        opacity: 0;
        animation-delay: ${delay * 0.1}s;
        animation-fill-mode: forwards;
        cursor: ${usage === "card" ? "pointer" : "default"};
      "
    >
      <div style="display: flex; align-items: flex-start; gap: 16px;">
       
        ${variant === 1 ?
      `
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <div style="display:flex;justify-content:space-between;gap:10px;align-items:start;">
                <h3 class=${usage === "card" ? "oppla-ai-feedback-card-title" : "oppla-ai-feedback-card-detail-title"} style="font-weight: 600; color: #374151; margin: 0; ">
                  ${title}
                </h3>
                ${usage === "card" ?
        `
                    <div style="display:flex;gap:4px;align-items:center;color:#474747;">
                      ${comments} ${renderCommentIcn({ stroke: "#474747" })}
                    </div>
                  `
        :
        ``}
              </div>
              <span style="background-color:${FeedbackTypes[type]?.color}; color: ${FeedbackTypes[type]?.text}; font-size: 10px; font-weight: 500; padding:3px 10px 2px 10px; border-radius: 16px; text-transform: uppercase; letter-spacing: 0.05em; width:max-content;">
                ${type}
              </span>
              <div style="display: flex; align-items: center; gap: 4px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background-color:${FeedbackStatus[status]?.color}; display: inline-block;"></span>
                <span style="font-size: 12px; color: #474747; font-weight: 500;">
                  ${FeedbackStatus[status]?.label}
                </span>
              </div>
              <span ${usage === "card" ? 'class="oppla-ai-feedback-card-description"' : ''} style="font-size: 15px; color: #474747 !important;line-height: 1.5;">
                ${description}
              </span>
              ${usage === "card" ?
        `
                  <span class="oppla-ai-ideas-card-comment-text" style="color:${primaryColor};display:flex;gap:5px;align-items:center;font-size:14px; font-weight:300;">
                    ${renderCommentIcn({ stroke: primaryColor })} Add a comment
                  </span>` : ``}
          
            </div>
          `
      :
      `
        <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
            <h3 class=${usage === "card" ? "oppla-ai-feedback-card-title" : "oppla-ai-feedback-card-detail-title"} style="font-weight: 600; color: #374151; margin: 0; ">
              ${title}
            </h3>
            <span style="background-color:${FeedbackTypes[type]?.color}; color: ${FeedbackTypes[type]?.text}; font-size: 10px; font-weight: 500; padding:3px 10px 2px 10px; border-radius: 16px; text-transform: uppercase; letter-spacing: 0.05em; width:max-content;">
              ${type}
            </span>
            ${usage === "card" ?
            `
                  <span class="oppla-ai-ideas-card-comment-text" style="color:${primaryColor};display:flex;gap:5px;align-items:center;font-size:14px; font-weight:300;">
                    ${renderCommentIcn({ stroke: primaryColor })} Add a comment
                  </span>` : ``}
              `
    }
      </div>
    </div>
  `;
};


// <div style="width: 49px; height: 49px; border: 1px solid #e5e7eb; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: white;">
// <button style="background: none; border: none; cursor: pointer; color: #9ca3af; display: flex; justify-content: center; width: 24px; height: 24px;">
//   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="m18 15-6-6-6 6"/>
//   </svg>
// </button>
// <span style="font-size: 18px; font-weight: 600; color: #4b5563; line-height: 1.5;">
//   ${votes}
// </span>
// </div>


export const renderTypeChip = (type: string) => {
  return `
    <span
      style="
        border: 1px solid ${FeedbackTypes[type]?.border};
        background-color:${FeedbackTypes[type]?.color}; 
        color: ${FeedbackTypes[type]?.text}; 
        font-size: 12px; 
        font-weight: 500; 
        padding:5px 8px; 
        border-radius: 10px; 
        letter-spacing: 0.05em; 
        width:max-content;
        display: flex;
        align-items: center;
        gap: 4px;
      ">
      ${FeedbackTypes[type]?.icon}
      <span>${FeedbackTypes[type]?.label}</span>
    </span>
  `
}

export const renderStatusChip = (status: string, isDarkMode: boolean) => {
  const borderColor = isDarkMode ? FeedbackStatus[status]?.darkMode.border : FeedbackStatus[status]?.lightMode.border;
  const textColor = isDarkMode ? FeedbackStatus[status]?.darkMode.text : FeedbackStatus[status]?.lightMode.text;
  const bgColor = isDarkMode ? FeedbackStatus[status]?.darkMode.color : FeedbackStatus[status]?.lightMode.color;
  const icon = isDarkMode ? FeedbackStatus[status]?.darkMode.icon : FeedbackStatus[status]?.lightMode.icon;
  return `
    <span
      style="
        border: 1px solid ${borderColor};
        background-color:${bgColor}; 
        color: ${textColor}; 
        font-size: 12px; 
        font-weight: 500; 
        padding:5px 8px; 
        border-radius: 10px; 
        letter-spacing: 0.05em; 
        width:max-content;
        display: flex;
        align-items: center;
        gap: 4px;
      ">
      ${icon}
      <span>${FeedbackStatus[status]?.label}</span>
    </span>
  `
}



// <span style="background-color:${FeedbackTypes[type]?.color}; color: ${FeedbackTypes[type]?.text}; font-size: 10px; font-weight: 500; padding:3px 10px 2px 10px; border-radius: 16px; text-transform: uppercase; letter-spacing: 0.05em; width:max-content;">
// ${type}
// </span>