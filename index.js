const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const urls = [
    "https://www.webmd.com",
    "https://www.mayoclinic.org",
    "https://www.cdc.gov",
    "https://www.nih.gov",
    "https://www.healthline.com",
    "https://www.medscape.com",
    "https://www.everydayhealth.com",
    "https://www.health.com",
    "https://www.nhs.uk",
    "https://www.medicinenet.com",
    "https://my.clevelandclinic.org",
    "https://www.hopkinsmedicine.org",
    "https://www.health.harvard.edu",
    "https://www.heart.org",
    "https://www.cancer.org",
    "https://www.who.int",
    "https://www.fda.gov",
    "https://www.menshealth.com",
    "https://www.womenshealthmag.com",
    "https://www.childrenshospital.org",
    "https://www.cdcfoundation.org",
    "https://www.psychologytoday.com",
    "https://www.mercola.com",
    "https://www.diabetes.org",
    "https://www.arthritis.org",
    "https://www.alz.org",
    "https://www.pediatrics.org",
    "https://www.celiac.org",
    "https://www.parkinson.org",
    "https://www.asthma.org",
    "https://www.aap.org",
    "https://www.autismspeaks.org",
    "https://www.nami.org",
    "https://www.eatright.org",
    "https://www.hiv.gov",
    "https://www.kidney.org",
    "https://www.stroke.org",
    "https://www.spine-health.com",
    "https://www.sleepfoundation.org",
]





const routesToCheck = ['jobs', 'careers']

async function checkWebsitesForEngineer(urls) {
  const websitesWithEngineer = [];

  const promises = urls.map(async (url) => {
    for (let route of routesToCheck) {
      try {
        let newUrl = url;
        if (newUrl[newUrl.length - 1] !== '/') newUrl += '/';
        newUrl += route;
        console.log(newUrl);
        const response = await axios.get(newUrl, { timeout: 5000 }); // Set a 5-second timeout
        const html = response.data;
        const $ = cheerio.load(html);
        const pageText = $('body').text().toLowerCase();

        if (pageText.includes('software') || pageText.includes('developer')) {
          websitesWithEngineer.push(newUrl);
        }
      } catch (error) {
        console.error(error.message);
      }
    }
  });

  await Promise.all(promises);

  return websitesWithEngineer;
}

// Example usage:
const websitesToCheck = [
  'https://example.com',
  'https://anotherexample.com',
  // Add more websites to the list as needed
];

checkWebsitesForEngineer(urls)
.then((result) => {
  console.log('Websites with "engineer" in /careers route:', result);
  saveResultsToFile(result)
})
.catch((error) => {
  console.error('Error checking websites:', error.message);
});

function saveResultsToFile(urls) {
  const filename = 'websites_with_engineer.txt';

  // Join the URLs into a newline-separated string
  const data = urls.join('\n');

  fs.writeFile(filename, data, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Results saved to', filename);
    }
  });
}