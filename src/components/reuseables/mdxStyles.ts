export const addMDXStyles = () => {
  return `
    #oppla-ai-announcement-description h1 {
      font-size: 18px;
      font-weight: bold;
    }

    #oppla-ai-announcement-description h2 {
      font-size: 17px;
      font-weight: 600;
    }

    #oppla-ai-announcement-description h3 {
      font-size: 14px;
      font-weight: 600;
    }

    #oppla-ai-announcement-description p {
      font-size: 14px;
      line-height: 1.5;
    }

    #oppla-ai-announcement-description a {
      font-size: 14px;
      text-decoration: underline;
    }

    #oppla-ai-announcement-description ul {
      font-size: 14px;
      padding-left: 20px;
      list-style-type: disc;
    }

    #oppla-ai-announcement-description ol {
      font-size: 14px;
      padding-left: 20px;
      list-style-type: decimal;
    }

    #oppla-ai-announcement-description li {
      font-size: 14px;
      margin-bottom: 5px;
      display: list-item;
    }

    #oppla-ai-announcement-description h1,
    #oppla-ai-announcement-description h2,
    #oppla-ai-announcement-description h3,
    #oppla-ai-announcement-description p,
    #oppla-ai-announcement-description ul{
      margin-bottom: 10px;
    }
  `;
};
