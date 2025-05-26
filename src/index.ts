import { Organization } from "./core/entities/Organization";
import { PropertiesType } from "./core/entities/Properties";
import { PublicFeedbackTypes } from "./core/entities/PublicFeedback";
import { saveToSessionStorage, getFromSessionStorage, getFromLocalStorage } from "./core/repositories/Storage";
import { fetchOrganizationData } from "./core/usecases/fetchOrganizationData";
import { getMatchedUrlItem } from "./core/usecases/getMatchedUrlItem";
import { openFeedbackSlider } from "./ui/feedbackSlider";
import { showPopup } from "./ui/popup";


export const SessionStorageName = "oppla-ai-feedback"

export const localStorageName = "oppla-ai-feedback-local"


export const frequencyTypes = {
  // oneTime: "One Time",
  everySession: "Every Session",
  everyTime: "Every Time"
}


/**
 * Initializes the popup handler by saving dummy organization data in sessionStorage.
 * @param {Object} options 
 * @param {string} options.organizationId - The ID of the organization.
 */


export async function init({ organizationId, websiteId, properties }: { organizationId: string, websiteId: string, properties: PropertiesType }): Promise<void> {
  if (!organizationId) {
    console.error("Error: organizationId is required.");
    return;
  }

  if (!websiteId) {
    console.error("Error: websiteId is required.");
    return;
  }
 

  const requiredFields: (keyof PropertiesType)[] = ["id", "email"];
  const missingFields = requiredFields.filter(field => !properties[field]);

  if (missingFields.length > 0) {
    console.error(`Error: Missing the following fields: [${missingFields.join(", ")}]`);
    return;
  }

  const existingData = getFromSessionStorage(SessionStorageName);


  if (existingData?.userData?.id !== properties.id) {
    // Find the organization data based on the provided ID
    const orgData = await fetchOrganizationData({ organizationId,websiteId })
    // if (!orgData.length) {
    //   console.error("Error: Organization not found for ID", organizationId);
    //   return;
    // }
    // Save data in sessionStorage
    saveToSessionStorage(SessionStorageName, { organizationId, websiteId, userData: properties, orgData,newFeedbackCount:5 });
  }
  // Check if the current URL matches allowed URLs
  checkAndShowPopup();
}


export function publicFeedback({ form, config }: PublicFeedbackTypes): void {
  const orgData = getFromSessionStorage(SessionStorageName);

  if (!orgData) {
    console.error("Error: OrganizationId not found");
    return
  };

  const openFeedbackData = {
    orgData,
    form,
    config
  }

  openFeedbackSlider(openFeedbackData)

}

/**
 * Checks if the current page URL is allowed and triggers the popup if applicable.
 */
function checkAndShowPopup(): void {
  // const currentPath = window.location.pathname; // Get current path like "/login", "/", "/about"
  const currentPath = window.location.href; // Get full URL including hostname, e.g., "https://example.com/login"

  const orgData = getFromSessionStorage(SessionStorageName);

  if (!orgData) return;

  // Check if any allowed URL matches the current path
  // const matchedOrg = (orgData.orgData ?? []).find((org:any) =>
  //   org.allowed_url?.includes(currentPath)
  // );
  const result = orgData.orgData ?? []
  const matchedOrg = getMatchedUrlItem(currentPath, result)

  if (matchedOrg) {

    const { id, metadata } = matchedOrg
    // const { frequency } = metadata


    // const data = getFromLocalStorage(localStorageName)

    const forms = orgData?.submittedForms ?? []
    //  || (forms.includes(id) && frequency === frequencyTypes.everyTime )
    if (!forms.includes(id)) {
      showPopup(matchedOrg);
    } else {
      console.log("Popup already submitted and frequency check not met.");
    }

    // showPopup(matchedOrg);
  } else {
    console.log("No matching allowed URLs found for this page.");
  }
}
