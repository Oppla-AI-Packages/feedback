import { renderCloseIcon } from "../components/reuseables/closeIcon";
import { onFeedbackCardClick, renderFeedbackDetails } from "../components/feedbackDetails";
import { ideasContainer, manageSubmitANewIdeaButton, renderFeedbacks, submitIdea } from "../components/ideas";
import { configData, formMetaData } from "../core/lib/config";
import { renderAnnouncementsIcon } from "../components/reuseables/announcementsIcon";
import { whiteLabelRender } from "./whiteLabel";
import { renderIdeasIcon } from "../components/reuseables/ideasIcon";
import { announcementContainer } from "../components/announcement";
import { addMDXStyles } from "../components/reuseables/mdxStyles";
import { roadMapContainer } from "../components/roadMap";
import { renderRoadMapIcon } from "../components/reuseables/roadMapIcon";
import { checkIsDarkMode } from "../components/reuseables/checkIsDarkMode";

/**
 * Fetches feedbacks from the server.
 */

let selectedCard: any = null


/**
 * Displays a feedback slider with form fields.
 */
export async function openFeedbackSlider(data: any): Promise<void> {
  if (document.getElementById("custom-slider-overlay")) return; // Avoid duplicate sliders

  const { orgData, config } = data;
  const { primaryColor = configData?.primaryColor, heading = configData.heading, theme = configData.theme } = config ?? {}
  const { ideas = configData.heading.ideas, announcement = configData.heading.announcement, roadMap = configData.heading.roadMap } = heading ?? {}
  const accountId = orgData?.organizationId;

  const isDarkMode = checkIsDarkMode({ theme });

  const backgroundColor = isDarkMode ? "#1B1D21" : "#F8F9FA";
  const textColor = "#000";

  // Create the overlay
  const overlay = document.createElement("div");
  overlay.id = "custom-slider-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "9999998";

  const slider = document.createElement("div");
  slider.id = "oppla-ai-slider";
  slider.style.display = "flex";
  slider.style.flexDirection = "column";
  slider.style.gap = "12px";
  slider.style.position = "fixed";
  slider.style.zIndex = "9999999";
  slider.style.top = "0%";
  slider.style.right = "0%";
  slider.style.height = "100%";
  slider.style.backgroundColor = backgroundColor;
  slider.style.color = textColor;
  slider.style.padding = "90px 15px 100px 15px";
  slider.style.borderRadius = "0px";
  slider.style.width = "90%";
  slider.style.maxWidth = "400px";
  slider.style.fontFamily = "'Inter', sans-serif";
  slider.style.animation = "slideIn 0.5s ease-in-out forwards"; // Apply animation



  const renderHeader = (heading: string) => {
    // background-color:${primaryColor}

    const headingBgColor = isDarkMode ? "#414549" : "#E5E7EB";
    const headingTextColor = isDarkMode ? "#E4E4E4CC" : "#374151";
    const bottomBorderColor = isDarkMode ? "#292B2F" : "#E5E7EB";

    return `
    <div style="border-bottom:1px solid ${bottomBorderColor};color:white;position:fixed;top:0;width:400px;display:flex;justify-content:space-between;align-items:center;padding:20px 20px; margin: 0px -15px;z-index:10;">
    <h3 class="oppla-ai-feedback-form-heading" style="margin: 0; padding: 4px 12px;border-radius:5px; background-color:${headingBgColor}; color:${headingTextColor};font-size:16px;">
      ${heading}
    </h3> 
    <span id="slider-close-button" style="cursor: pointer;z-index: 25; width: max-content;">
  ${renderCloseIcon({ stroke: isDarkMode ? "#9FA1A7" : "#718096", size: "20" })}

    </span>
</div>
    `
  }

  const addStyles = () => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `

    ${addMDXStyles()}


    /* Loader Container */
.oppla-ai-spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width:100%;
      height: -webkit-fill-available;
}

/* Spinner Animation */
.oppla-ai-spinner {
  width: 30px;
  height: 30px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: ${primaryColor}; /* Blue spinner */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* No Data Found Message */
.oppla-ai-no-data {
  text-align: center;
  font-size: 14px;
  color: #999;
  font-weight: normal;
  padding: 20px;
      height: -webkit-fill-available;
    display: flex;
    justify-content: center;
    align-items: center;
}



     @keyframes slideIn {
    from {
      transform: translateX(100%); /* Start off-screen */
    }
    to {
      transform: translateX(0); /* Move into view */
    }
  }

@keyframes slideOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%); /* Move off-screen */
  }
}

.oppla-aiHideSlider {
  animation: slideOut 0.5s ease-in-out forwards !important;
}


    .oppla-ai-feedback-hidden-scrollbar {
  overflow-y: auto;
  max-height: 100vh;
  scrollbar-width: none;  /* Firefox */
  -ms-overflow-style: none;  /* Internet Explorer & Edge */
}

/* Hide scrollbar for WebKit (Chrome, Safari) */
.oppla-ai-feedback-hidden-scrollbar::-webkit-scrollbar {
  display: none;
}


.oppla-ai-ideas-card-comment-text{
opacity:0;
}

.oppla-ai-feedback-card-animate:hover .oppla-ai-ideas-card-comment-text{
    opacity:1;
}


.oppla-ai-feedback-card-description{
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limits text to 3 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
  margin:0;
}


  .oppla-ai-feedback-card-detail-title{
    text-decoration:none;
  font-size:17px;
  color:#424242;
  }

.oppla-ai-feedback-card-title {
  max-width: 280px; /* Adjust width based on your layout */
  font-size:17px;
  color:#347151;
}

.oppla-ai-idea-comment-container:hover .oppla-ai-idea-comment-delete-icon{
    display:block
}

.oppla-ai-idea-comment-delete-icon{
    display:none
}


      .oppla-ai-feedback-form-container{
        background-color: transparent;
        padding:15px;
        border-radius:5px;
        margin-bottom:15px;
        border:1px solid ${isDarkMode ? "#313337" : "#31333740"};
      }

      .oppla-ai-feedback-form-heading {
        font-size: 16px;
        margin: 0;
      }
  
      @media screen and (max-width: 700px) {
        .oppla-ai-feedback-form-heading {
          font-size: 16px;
        }
      }
  
      .oppla-ai-feedback-form-description {
        font-size: 16px;
      }
  
      @media screen and (max-width: 700px) {
        .oppla-ai-feedback-form-description {
          font-size: 12px;
        }
      }

      /* Animation classes for card transitions */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.oppla-ai-feedback-card-animate {
  animation: fadeIn 0.4s ease-out forwards;
}


.oppla-ai-tab-btn{
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    gap:5px;
    font-size:12px;
    cursor:pointer;
    font-weight:bold;
    padding:5px;
    border-radius:5px;
}

.oppla-ai-tab-btn:hover {
background-color:rgba(236,236,236,0.5)
}

.oppla-ai-disabled-btn {
  cursor: not-allowed !important; /* Show disabled cursor */
  opacity: 0.6;
  pointer-events: none; /* Prevent clicks */
  border-radius:5px;
}

    `;
    document.head.appendChild(styleElement);
  };

  const removeStyles = () => {
    const styles = document.head.getElementsByTagName("style");
    for (let i = 0; i < styles.length; i++) {
      if (styles[i].innerHTML.includes(".oppla-ai-feedback")) {
        styles[i].remove();
        break;
      }
    }
  };

  const tabs: any = {
    ideas: {
      value: "ideas",
      icon: (stroke?: string) => renderIdeasIcon({ stroke }),
      label: "Feedback",
      content: () => ideasContainer(data, selectedCard),
      heading: ideas,
    },
    announcement: {
      value: "announcement",
      icon: (stroke?: string) => renderAnnouncementsIcon({ stroke }),
      label: "Announcements",
      content: () => announcementContainer(data),
      heading: announcement
    },
    roadMap: {
      value: "roadMap",
      icon: (stroke?: string) => renderRoadMapIcon({ stroke }),
      label: "Roadmap",
      content: () => roadMapContainer(data, selectedCard),
      heading: roadMap,
    }
  };

  const tabsArray = Object.keys(tabs).map((item: any) => ({ ...tabs[item] }));

  let selectedTab = "ideas";




  function renderTabs() {

    const containerBg = isDarkMode ? "#222429" : "#fff"

    const tabActiveColor = isDarkMode ? "#D2D3E0" : "#1D1D1D";
    const tabActiveBgColor = isDarkMode ? "#52525B61" : "#E8E8E8";

    const tabColor = isDarkMode ? "#5B5B60" : "#71809650";

    const tabBorderColor = isDarkMode ? "none" : "1px solid #CFCFCF";

    const whiteLabelColor = isDarkMode ? "#5B5B60" : "#5B5B60";

    slider.innerHTML = selectedCard ? renderFeedbackDetails(selectedCard, data) : `
        ${renderHeader(tabs[selectedTab]?.heading)}
        <div id="oppla-ai-tab-content">
        </div>
        <div style="
          position: fixed;
          bottom: 0px;
          background:${containerBg};
          padding:20px 20px 5px 20px;
          margin:0 0 0 -15px;
          max-width: 400px;
          width:100%;
        ">
            <div id="tab-container" style="display:grid;grid-template-columns:repeat(${tabsArray.length},1fr);gap:5px;">
                ${tabsArray.map((tab) => `
                    <div class="oppla-ai-tab-btn" data-tab="${tab.value}" 
                        style="
                        color:${selectedTab === tab.value ? tabActiveColor : tabColor};
                        cursor: pointer;
                        background-color:${selectedTab === tab.value ? tabActiveBgColor : "transparent"};
                        border:${selectedTab === tab.value ? tabBorderColor : "none"};
                    ">
                    <span> ${tab?.icon(selectedTab === tab.value ? tabActiveColor : tabColor)}</span>
                    <span>${tab.label}</span>
                    </div>
                `).join("")}
            </div>
            <div style="display:flex; justify-content:end;width:100%; padding :5px 0 0 0;">
                ${whiteLabelRender({ fontSize: "10px", color: whiteLabelColor })}
            </div>
        </div>
    `;

    setTimeout(() => {
      const closeButton = document.getElementById("slider-close-button")
      // Add click event to close button
      if (closeButton) {
        closeButton.addEventListener("click", (event) => {
          closeSlider();
          event.stopPropagation(); // Prevent event from bubbling up
        });

      }
    }, 100);
  }

  // Attach a single event listener to the parent container
  document.addEventListener('click', async (event: any) => {
    const tabBtn = event.target.closest('.oppla-ai-tab-btn');
    if (tabBtn) {
      selectedTab = tabBtn.getAttribute('data-tab');
      renderTabs(); // Re-render UI with new tab
      tabs[selectedTab]?.content()
      // if (tabs[selectedTab]?.afterRender) {
      //   await tabs[selectedTab]?.afterRender()
      // }
      // await announcementContainer(data)
    }
  });

  setTimeout(() => {
    renderTabs()
    tabs[selectedTab]?.content()
  }, 100);



  addStyles();
  // slider.appendChild(closeButton);
  document.body.appendChild(overlay);
  document.body.appendChild(slider);
  document.body.style.overflow = "hidden";







  // Function to close the slider
  const closeSlider = () => {
    slider.classList.add("oppla-aiHideSlider"); // Add the hide animation class

    // Wait for animation to complete before removing
    setTimeout(() => {
      slider.remove();
      overlay.remove();
      selectedCard = null; // Reset selectedCard when closing the slider
      removeStyles();
      document.body.removeEventListener("click", handleOutsideClick);
    }, 500); // Adjust the timeout to match the animation duration
  };



  // setTimeout(() => {
  //   const closeButton = document.getElementById("slider-close-button")
  //   // Add click event to close button
  //   if (closeButton) {
  //     closeButton.addEventListener("click", (event) => {
  //       closeSlider();
  //       event.stopPropagation(); // Prevent event from bubbling up
  //     });

  //   }
  // }, 100);
  // Function to close the slider when clicking outside
  const handleOutsideClick = (event: MouseEvent) => {
    if (!slider.contains(event.target as Node)) {
      closeSlider();
    }
  };

  setTimeout(() => {
    document.body.addEventListener("click", handleOutsideClick);
  }, 100); // Small delay to prevent immediate closing when opening the slider





}
