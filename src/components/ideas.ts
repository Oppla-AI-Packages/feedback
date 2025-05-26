import { configData, formMetaData } from "../core/lib/config";
import { FeedbackTypesArray, SubmissionMode } from "../core/lib/enum";
import { fetchPublicFeedbacks } from "../core/usecases/fetcPublicFeedbacks";
import { handleSubmit } from "../core/usecases/handleSubmit";
import { onFeedbackCardClick } from "./feedbackDetails";
import { checkIsDarkMode } from "./reuseables/checkIsDarkMode";
import { renderCloseIcon } from "./reuseables/closeIcon";
import { FeatureCards } from "./reuseables/featureCard";

export const ideasContainer = async (data: any, selectedCard: any) => {
  const { orgData, form, config } = data;
  const { primaryColor = configData?.primaryColor, heading = configData.heading,theme= configData.theme} = config  ?? {}
  const accountId = orgData?.organizationId;
  const websiteId = orgData?.websiteId;
  const isDarkMode = checkIsDarkMode({ theme });





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

      const labelColor = isDarkMode ? "#98989E" : "#6B7280";

      input.addEventListener("blur", () => {
        (label as HTMLElement).style.color = labelColor;
        input.style.border = "none"; // Ensure border stays removed after blur
      });
    }
  });

  renderFeedbacks(accountId, websiteId,false,primaryColor,isDarkMode);



  // to submit the ideas
  submitIdea({ orgData,primaryColor,isDarkMode })

  // ✅to manage the submit a new idea button
  manageSubmitANewIdeaButton()


  // to manage click on the ideas feedback card
  onFeedbackCardClick(selectedCard, data,primaryColor,isDarkMode)

}

export const renderIdeaForm = (data: any) => {


  const { orgData, form, config } = data;
  const { title = formMetaData?.title, description = formMetaData?.description } = form ?? {};
  const { primaryColor = configData?.primaryColor, heading = configData.heading ,theme= configData.theme } = config ?? {}

  const isDarkMode = checkIsDarkMode({ theme });


  const backgroundColor = "transparent";
  const textColor = "#000";

  const labelColor = isDarkMode ? "#98989E" : "#6B7280";
  const fieldBg = isDarkMode ? "#222429" : "#FFFFFF";
  const fieldTextColor = isDarkMode ? "#FAFAFA" : "#303540";
  const fieldBorder = isDarkMode ? "1px solid #52526F40" : "1px solid #E5E7EB";

  // <span class="oppla-ai-feedback-form-description" style="color:#4747474">${description}</span>

  return `
   <div id="form-container" class="oppla-ai-feedback-form-container" style="position: relative;">
      <span id="close-form-btn" type="button" style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; cursor: pointer; font-size: 16px;">
        ${renderCloseIcon({size:"20px",stroke: isDarkMode ? "#9FA1A7" : "#718096"})}
      </span>

      <div id="feedback-form" style="display:flex;flex-direction:column;gap:15px;">
        <h2 class="oppla-ai-feedback-form-heading" style="color:${isDarkMode ? "#D2D3E0" : "#303540"};font-weight:bold;margin:0px;padding:0px;">${title}</h2>
        <hr style="height:0.2px;border:none; background: ${isDarkMode ? "#313337" : "#31333740"};"/>

        <div style="display: flex; flex-direction: column; gap: 8px;border-radius:2px;width: 100%;">
          <label for="slider-type" style="display: block; text-align: left; font-size:13px; font-weight:550;color:${labelColor};">Type</label>
          <select id="slider-type" style="height:30px;padding: 6px 8px;font-size:12px; border-radius: 5px; background: ${fieldBg}; color: ${fieldTextColor}; border:${fieldBorder};" >
            ${FeedbackTypesArray.map((option: any) => (
    `<option value="${option?.value}">${option?.label}</option>`
  ))}
          </select>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;border-radius:2px;width: 100%;">
          <label for="slider-title" style="display: block; text-align: left; font-size:13px; font-weight:550;color:${labelColor};">Title</label>
          <input 
            type="text" 
            id="slider-title" 
            placeholder="Enter a descriptive title"
            autocomplete="off" 
            style="padding: 6px 8px;font-size:12px; border-radius: 5px; background: ${fieldBg}; color: ${fieldTextColor};border:${fieldBorder};"
          />
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;border-radius:2px;width: 100%;">
          <label for="slider-description" style="display: block; text-align: left; font-size:13px; font-weight:550;color:${labelColor};">Description</label>
          <textarea 
            id="slider-description" 
            placeholder="Enter a description" 
            autocomplete="off" 
            rows="5"
            style="padding: 6px 8px;font-size:12px; border-radius: 5px; background: ${fieldBg}; color: ${fieldTextColor}; resize: none;border:${fieldBorder};"
          ></textarea>
        </div>

        <span id="slider-error" style="color: red; display: none; font-size:12px;">All fields are required</span>
        <div style="display: flex;justify-content: start;gap: 12px;">
          <button id="slider-submit" style="padding: 5px 20px; background-color: ${primaryColor}; border: none; border-radius: 5px; color: #fff; font-size: 14px; cursor: pointer;">
            Submit
          </button>
        </div>
      </div>
    </div>

    <div id="feedback-list"></div>
    <div id="feedback-details" style="display: none;"></div>

    <div id="reopen-form-btn-container" style="display: none; position: fixed;  bottom: 90px; margin:0 0 0 -15px; z-index: 12;">
      <div style="display:flex; justify-content:center;width:400px; padding :10px 0;">
        <button 
          id="reopen-form-btn"
          style="
            background-color: ${primaryColor};
            color: white;
            border: none;
            border-radius: 5px;
            padding: 12px 20px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
            cursor: pointer;
            transition: all 0.2s ease;
            z-index: 10;
          "
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
          </svg>
          SUGGEST A NEW IDEA
        </button>
      </div>
    </div>
  `
}


export const submitIdea = ({ orgData, primaryColor,isDarkMode }: { orgData?: any, primaryColor: string, isDarkMode:boolean }) => {
  
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
    const websiteId = orgData?.websiteId;
    

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
      submission_mode:SubmissionMode.feedback 
    }


    const res = await handleSubmit(dataToSend);
    if (res.error) {
      document.getElementById("slider-error")!.textContent = res.error;
      document.getElementById("slider-error")!.style.display = "block";
    } else {
      renderFeedbacks(accountId, websiteId,true,primaryColor,isDarkMode);
      (document.getElementById("slider-title") as HTMLInputElement).value = "";
      (document.getElementById("slider-description") as HTMLTextAreaElement).value = "";
    }

    submitButton.disabled = false;
    submitButton.classList.remove("oppla-ai-disabled-btn");

  });
}


// export async function renderFeedbacks(accountId: string, resetData:boolean = false) {
//   try {
//     let currentPage = 1;
//     let isFetching = false;
//     let hasMoreData = true;
//     let isListenerAdded = false;

//     const container = document.querySelector(".oppla-ai-feedback-hidden-scrollbar");
//     const feedbackContainer = document.getElementById("feedback-list")
//     if (!container || !feedbackContainer) return;


//     if (resetData) {
//       currentPage = 1;
//       hasMoreData = true;
//       feedbackContainer.innerHTML = ""; // Clear previous feedbacks
//     }

//     const loadMoreFeedbacks = async () => {
//       if (isFetching || !hasMoreData) return;
//       isFetching = true;

//       const res = await fetchPublicFeedbacks({ organizationId: accountId, page: currentPage });
//       const feedbacks = res?.data || [];

//       if (feedbacks.length > 0) {
//         const fragment = document.createDocumentFragment();
//         feedbacks.forEach((feedback: any, index: number) => {
//           const card = document.createElement("div");
//           card.innerHTML = FeatureCards(feedback, index, "card");
//           card.setAttribute("data-feedback", JSON.stringify(feedback)); // Store ID for delegation
//           fragment.appendChild(card);
//         });

//         feedbackContainer.style.cssText = "border: 1px solid #e5e7eb; border-radius: 12px;overflow: hidden;background-color: white;box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);"
//         feedbackContainer.appendChild(fragment); // Append all at once
//         currentPage++; // Move to next page
//       } else {
//         hasMoreData = false; // Stop fetching if no more data
//       }

//       isFetching = false;
//     };

//     await loadMoreFeedbacks(); // Load initial feedbacks

//     const handleScroll = async () => {
//       const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 20;
//       if (nearBottom) {
//         await loadMoreFeedbacks();
//       }
//     };

//     setTimeout(() => {
//       container.addEventListener("scroll", handleScroll);
//   }, 100);

//   } catch (error) {
//     console.error("Error loading feedbacks:", error);
//   }
// }

export async function renderFeedbacks(accountId: string,websiteId:string, resetData: boolean = false,primaryColor:string,isDarkMode:boolean) {


  try {
    let currentPage = 1;
    let isFetching = false;
    let hasMoreData = true;
    let isFirstLoad = true; // Flag to track first load

    const container = document.querySelector(".oppla-ai-feedback-hidden-scrollbar");
    const feedbackContainer = document.getElementById("feedback-list");
    if (!container || !feedbackContainer) return;

    if (resetData) {
      currentPage = 1;
      hasMoreData = true;
      feedbackContainer.innerHTML = ""; // Clear previous feedbacks
    }


    if (isFirstLoad) {
      feedbackContainer.innerHTML = `
        <div class="oppla-ai-spinner-container">
          <div class="oppla-ai-spinner"></div>
        </div>
      `;
    }


    // const loadMoreFeedbacks = async () => {
    //   if (isFetching || !hasMoreData) return;
    //   isFetching = true;

    


    //   const res = await fetchPublicFeedbacks({ organizationId: accountId, page: currentPage });
    //   const feedbacks = res?.data || [];

    //   feedbackContainer.innerHTML = ""; // Remove loader on first load
    //   isFirstLoad = false; // Set flag to false after first fetch

    //   if (feedbacks.length > 0) {
    //     const fragment = document.createDocumentFragment();
    //     feedbacks.forEach((feedback: any, index: number) => {
    //       const card = document.createElement("div");
    //       card.innerHTML = FeatureCards(feedback, index, "card");
    //       card.setAttribute("data-feedback", JSON.stringify(feedback)); // Store ID for delegation
    //       fragment.appendChild(card);
    //     });

    //     feedbackContainer.style.cssText = "border: 1px solid #e5e7eb; border-radius: 12px;overflow: hidden;background-color: white;box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);";
    //     feedbackContainer.appendChild(fragment); // Append all at once
    //     currentPage++; // Move to next page
    //   } else if (currentPage === 1) {
    //     hasMoreData = false;
    //     // const noFeedbackMessage = document.createElement("div");
    //     // noFeedbackMessage.className = "no-feedback-message";
    //     // noFeedbackMessage.textContent = "No ideas found.";
    //     // feedbackContainer.appendChild(noFeedbackMessage);
    //   } else {
    //     hasMoreData = false;
    //   }

    //   isFetching = false;
    // };

    const loadMoreFeedbacks = async () => {
      if (isFetching || !hasMoreData) return;
      isFetching = true;
    
      const res = await fetchPublicFeedbacks({ organizationId: accountId, page: currentPage,websiteId:websiteId });
      const feedbacks = res?.data || [];
    
      if (isFirstLoad) {
        feedbackContainer.innerHTML = ""; // Remove loader only on first load
        isFirstLoad = false;
      }
    
      if (feedbacks.length > 0) {
        const fragment = document.createDocumentFragment();
        feedbacks.forEach((feedback: any, index: number) => {
          const card = document.createElement("div");
          card.innerHTML = FeatureCards(feedback, index, "card",primaryColor,1,isDarkMode);
          card.setAttribute("data-feedback", JSON.stringify(feedback));
          card.setAttribute("data-feedback-id", feedback?.id);
          fragment.appendChild(card);
        });
    
        // feedbackContainer.style.cssText = "border: 1px solid #e5e7eb; border-radius: 12px;overflow: hidden;background-color: white;box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);";
        feedbackContainer.style.cssText = "display:flex;flex-direction:column;gap:15px;overflow-y:hidden;";
        feedbackContainer.appendChild(fragment); // Append all at once
        currentPage++;
      } else {
        if (currentPage === 1) {
          feedbackContainer.innerHTML = `<div class="oppla-ai-no-data">No ideas found.</div>`;
        }
        hasMoreData = false;
      }
    
      isFetching = false;
    };
    

    await loadMoreFeedbacks(); // Load initial feedbacks

    const handleScroll = async () => {
      const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 20;
      if (nearBottom) {
        await loadMoreFeedbacks();
      }
    };

    setTimeout(() => {
      container.addEventListener("scroll", handleScroll);
    }, 100);
  } catch (error) {
    console.error("Error loading feedbacks:", error);
  }
}


export const manageSubmitANewIdeaButton = () => {
  setTimeout(() => {
    const formContainer = document.getElementById("form-container");
    const closeFormBtn = document.getElementById("close-form-btn");
    const reopenFormBtnContainer = document.getElementById("reopen-form-btn-container");
    const reopenFormBtn = document.getElementById("reopen-form-btn");

    if (closeFormBtn && reopenFormBtnContainer && formContainer && reopenFormBtn) {
      closeFormBtn.addEventListener("click", function () {
        formContainer.style.display = "none"; // Hide form
        reopenFormBtnContainer.style.display = "block"; // Show reopen button
      });

      reopenFormBtnContainer.addEventListener("click", function () {
        formContainer.style.display = "block"; // Show form
        reopenFormBtnContainer.style.display = "none"; // Hide reopen button
      });

      reopenFormBtn.addEventListener("mouseenter", () => {
        reopenFormBtn.style.transform = "translateY(-2px)";
        reopenFormBtn.style.boxShadow = "0 6px 18px rgba(79, 70, 229, 0.4)";
      });

      reopenFormBtn.addEventListener("mouseleave", () => {
        reopenFormBtn.style.transform = "translateY(0)";
        reopenFormBtn.style.boxShadow = "0 4px 14px rgba(79, 70, 229, 0.3)";
      });

      const scrollableDiv = document.querySelector(".oppla-ai-feedback-hidden-scrollbar");
      // Scroll event to show/hide reopenFormBtnContainer based on scroll height
      if (scrollableDiv) {
        scrollableDiv.addEventListener("scroll", function () {
          const scrollPosition = scrollableDiv.scrollTop
          const triggerHeight = 400
          if (scrollPosition <= triggerHeight && formContainer.style.display === "none") {
            reopenFormBtnContainer.style.display = "block"; // Show when at 130vh
          } else {
            reopenFormBtnContainer.style.display = "none"; // Hide otherwise
          }
        });
      }
    }
  }, 0);

}