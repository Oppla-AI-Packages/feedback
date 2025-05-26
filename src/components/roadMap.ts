import { configData } from "../core/lib/config";
import { FeedbackStatus, SubmissionMode } from "../core/lib/enum";
import { fetchRoadMaps } from "../core/usecases/fetchRoadMaps";
import { handleSubmit } from "../core/usecases/handleSubmit";
import { onFeedbackCardClick } from "./feedbackDetails";
import { manageSubmitANewIdeaButton, renderIdeaForm } from "./ideas";
import { checkIsDarkMode } from "./reuseables/checkIsDarkMode";
import { FeatureCards } from "./reuseables/featureCard";

export const roadMapContainer = async (data: any, selectedCard: any) => {
    const { orgData, form, config } = data;
    const { primaryColor = configData?.primaryColor, heading = configData.heading, theme = configData?.theme } = config ?? {}

    const isDarkMode = checkIsDarkMode({ theme })


    const accountId = orgData?.organizationId;
    const websiteId = orgData?.websiteId
    const container = document.createElement("div");
    container.className = "oppla-ai-feedback-hidden-scrollbar";
    // container.style.cssText = "display:flex;flex-direction:column;gap:15px;overflow-y:auto;padding:1px;height:500px";
    container.style.overflowY = "auto"
    container.style.display = "flex"
    container.style.flexDirection = "column"
    container.style.gap = "15px"
    container.style.padding = "1px"
    container.style.height = "calc(100vh - 190px)"

    const ideaForm = document.createElement("div");

    ideaForm.innerHTML = renderIdeaForm(data)

    container.appendChild(ideaForm)


    const opplaaiTabContent = document.getElementById("oppla-ai-tab-content")
    opplaaiTabContent?.appendChild(container)

    const fields = ["slider-title", "slider-type", "slider-description"];

    fields.forEach((field) => {
        const input = document.getElementById(field);
        const label = document.querySelector(`label[for="${field}"]`);

        if (input && label) {
            input.addEventListener("focus", () => {
                (label as HTMLElement).style.color = primaryColor;
                input.style.outline = "none"; // Removes focus outline
                input.style.border = "none"; // Removes border
            });

            input.addEventListener("blur", () => {
                (label as HTMLElement).style.color = "black";
                input.style.border = "none"; // Ensure border stays removed after blur
            });
        }
    });


    renderFeedbacks(accountId, websiteId, false, primaryColor, isDarkMode);

    // to submit the ideas
    submitIdea({ orgData, primaryColor, isDarkMode })

    // ✅to manage the submit a new idea button
    manageSubmitANewIdeaButton()


    // to manage click on the ideas feedback card
    onFeedbackCardClick(selectedCard, data, primaryColor, isDarkMode)

}


export async function renderFeedbacks(accountId: string, websiteId: string, resetData: boolean = false, primaryColor: string, isDarkMode: boolean) {
    const container = document.querySelector(".oppla-ai-feedback-hidden-scrollbar");
    const feedbackContainer = document.getElementById("feedback-list");

    if (!feedbackContainer) return;

    // Clear existing content if resetData is true
    if (resetData) {
        feedbackContainer.innerHTML = "";
    }

    // Show loading spinner
    const spinner = document.createElement("div");
    spinner.classList.add("spinner");
    spinner.innerHTML = `
      <div class="oppla-ai-spinner-container">
          <div class="oppla-ai-spinner"></div>
        </div>
    `;
    feedbackContainer.appendChild(spinner);


    const { data } = await fetchRoadMaps({ organizationId: accountId, websiteId })

    feedbackContainer.innerHTML = ""; // Remove spinner after loading

    feedbackContainer.style.display = "flex"
    feedbackContainer.style.flexDirection = "column"
    feedbackContainer.style.gap = "15px"


    const borderColor = isDarkMode ? "1px solid #292B2F" : "1px solid #31333740";
    const headerColor = isDarkMode ? "#D2D3E0" : "#303540";

    const counterBackgroundColor = isDarkMode ? "#FFFFFFD9" : "#1F2026D9";
    const counterTextColor = isDarkMode ? "#1F2026" : "#F8F9FA";

    // Render accordions
    data.forEach((section: any, index: number) => {
        // Create accordion container
        const accordion = document.createElement("div");
        accordion.classList.add("accordion");
        accordion.style.border = borderColor
        // accordion.style.borderTop = `2px solid ${FeedbackStatus[section?.status]?.color}`
        // accordion.style.boxShadow = "0 1px 3px rgba(0, 0, 0, .12), 0 1px 2px rgba(0, 0, 0, .24)"
        accordion.style.borderRadius = "8px"

        // Create status (accordion header)
        const statusHeader = document.createElement("div");
        statusHeader.classList.add("accordion-header");
        // <span style="width: 8px; height: 8px; border-radius: 50%; background-color:${FeedbackStatus[section?.status]?.color}; display: inline-block;"></span>
        statusHeader.innerHTML = `
         <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 15px; color:${headerColor}; font-weight: 600;">
                   ${FeedbackStatus[section?.status]?.label}
                </span>
                ${section?.data?.length > 0 ? `<span 
                    style="
                        background-color:${counterBackgroundColor};
                        color:${counterTextColor};
                        padding: 2px 6px;
                        border-radius:8px;
                        font-size: 12px;
                        font-weight: 500;
                        margin-left: 15px;
                    "
                >
                ${section?.data?.length} ${section?.data?.length === 1 ? "Item" : "Items"}
                </span>`: ``}
              </div>
        `
        statusHeader.style.cursor = "pointer";
        statusHeader.style.fontSize = "16px";
        statusHeader.style.padding = "10px 20px";
        statusHeader.style.display = "flex";
        statusHeader.style.justifyContent = "space-between";
        statusHeader.style.alignItems = "center";
        statusHeader.style.zIndex = "99999999";
        statusHeader.style.borderBottom = borderColor
        // Add arrow icon
        const arrow = document.createElement("span");
        arrow.innerHTML = renderAccordionCloseIcon({ stroke: headerColor }); // Closed state
        statusHeader.appendChild(arrow);

        // Create content container
        const content = document.createElement("div");
        content.classList.add("accordion-content");
        content.style.display = "block";
        // content.style.border = "1px solid #ddd";
        // content.style.borderTop = "none";
        content.style.marginBottom = "10px";

        // Render cards
        if (section?.data?.length > 0) {
            section?.data?.forEach((item: any, idx: number) => {
                const card = document.createElement("div");
                card.innerHTML = FeatureCards(item, idx, "card", primaryColor, 2, isDarkMode);
                card.setAttribute("data-feedback", JSON.stringify(item));
                card.setAttribute("data-feedback-id", item?.id);
                content.appendChild(card);
            });
        } else {
            content.innerHTML = `<div class="oppla-ai-no-data">No ideas found.</div>`
        }

        // Toggle accordion on click
        statusHeader.addEventListener("click", () => {
            const isOpen = content.style.display === "block";
            statusHeader.style.borderBottom = !isOpen ? borderColor : "none"; // Toggle border
            content.style.display = isOpen ? "none" : "block";
            arrow.innerHTML = !isOpen ? renderAccordionCloseIcon({ stroke: headerColor }) : renderAccordionOpenIcon({ stroke: headerColor }); // Toggle arrow
        });

        // Prevent event bubbling when clicking the arrow
        arrow.addEventListener("click", (event) => {
            event.stopPropagation(); // Stop the event from reaching statusHeader
            const isOpen = content.style.display === "block";
            content.style.display = isOpen ? "none" : "block";
            arrow.innerHTML = !isOpen ? renderAccordionCloseIcon({ stroke: headerColor }) : renderAccordionOpenIcon({ stroke: headerColor }); // Toggle arrow
        });


        // Append elements
        accordion.appendChild(statusHeader);
        accordion.appendChild(content);
        feedbackContainer.appendChild(accordion);
    });
}



export const submitIdea = ({ orgData, primaryColor, isDarkMode }: { orgData?: any, primaryColor: string, isDarkMode: boolean }) => {

    const inputs = [
        document.getElementById("slider-type") as HTMLSelectElement,
        document.getElementById("slider-title") as HTMLInputElement,
        document.getElementById("slider-description") as HTMLTextAreaElement
    ];

    inputs.forEach(input => {
        input.addEventListener("input", () => {
            input.style.border = "none";
            document.getElementById("slider-error")!.style.display = "none";
        });
    });



    document.getElementById("slider-submit")?.addEventListener("click", async () => {
        const submitButton = document.getElementById("slider-submit") as HTMLButtonElement;
        const type = (document.getElementById("slider-type") as HTMLSelectElement).value;
        const title = (document.getElementById("slider-title") as HTMLInputElement).value;
        const description = (document.getElementById("slider-description") as HTMLTextAreaElement).value;
        const accountId = orgData?.organizationId;
        const websiteId = orgData


        // let hasError = false;
        // inputs.forEach(input => {
        //   if (!input.value.trim()) {
        //     input.style.border = "1px solid red";
        //     hasError = true;
        //   }
        // });

        // if (hasError) {
        //   document.getElementById("slider-error")!.style.display = "block";
        //   return;
        // }

        if (!title.trim() || !description.trim()) {
            document.getElementById("slider-error")!.style.display = "block";
            return;
        }

        submitButton.disabled = true;

        submitButton.classList.add("oppla-ai-disabled-btn");

        const website = window.location.hostname

        const dataToSend = {
            title: title,
            description: description ?? "",
            type: type,    // How we will define its a type of feature, tasks, or bug, we can add more types here.
            feedback_id: "",
            source: {
                id: website,
                name: "slider", //popup
                type: "Website",
            },
            user_id: orgData?.userData?.id,
            user_name: orgData?.userData?.name,
            user_email: orgData?.userData?.email,
            created_at: new Date(),
            updated_at: new Date(),
            last_retrieved_message: false,
            account_id: orgData?.organizationId,
            meta_data: null,
            is_public: false, // false
            website_id: orgData?.websiteId,
            submission_mode: SubmissionMode.feedback
        }

        const res = await handleSubmit(dataToSend);
        if (res.error) {
            document.getElementById("slider-error")!.textContent = res.error;
            document.getElementById("slider-error")!.style.display = "block";
        } else {
            renderFeedbacks(accountId, websiteId, true, primaryColor, isDarkMode);
            (document.getElementById("slider-title") as HTMLInputElement).value = "";
            (document.getElementById("slider-description") as HTMLTextAreaElement).value = "";
        }

        submitButton.disabled = false;
        submitButton.classList.remove("oppla-ai-disabled-btn");

    });
}


const renderAccordionCloseIcon = ({ stroke }: { stroke: string }) => {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke=${stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
    `
    //     return `
    //  <svg width="15px" height="15px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill=${stroke}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M903.232 768l56.768-50.432L512 256l-448 461.568 56.768 50.432L512 364.928z" fill=${stroke}></path></g></svg>
    //   `
}

const renderAccordionOpenIcon = ({ stroke }: { stroke: string }) => {
    //     return `
    //   <svg width="15px" height="15px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill=${stroke}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill=${stroke}></path></g></svg>
    //   `

    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke=${stroke} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
    `

}