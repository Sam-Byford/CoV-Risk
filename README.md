# CoV-Risk
.NET Core and Angular web application developed for final year dissertation project. Analyses supplied patient data to calculate if the patient is at high risk for developing a severe form of COVID-19

![User-120221](https://user-images.githubusercontent.com/32711675/127788024-5e7cee4e-5fc9-4243-a0c1-ab06af00d897.PNG)

The following provides a brief overview of the project, for an in-depth description and evaluation of the project, view the **'Report.pdf'** file.

## Application Demonstration

60 Second Demonstration Video - https://youtu.be/k8zp8ZnAE38 

## Aim and Objectives

CoV-Risk aimed to efficiently flag and notify individuals who should be prioritized for a COVID-19 vaccination and present the data in a clear, logical manner. It does this by analysing patients on a more individual basis. Instead of simply stating that patients over a certain age get the vaccination first, CoV-Risk utilises a custom points-based algorithm to examine the patients’ pre-existing conditions, sex, and age to give them a risk score. The higher the risk score, the higher the patient’s priority. This custom-built algorithm is then accessed by medical professionals using a fully secure, interactive, website application. 

To complete the aim of the project, objectives were created to help guide the development. These objectives laid out clear markers for the programming of the project with the development conducted using **R, Angular, ASP.NET Core and SQL.**

1.	Compile an extensive list of the factors that lead to serious illness with COVID-19 
2.	Assign point values (weights) to the factors based on how influential they are to causing a severe case of COVID-19 and calculate a 'high-risk threshold' value 
3.	Develop the points-based algorithm that analyses supplied data and uses the weighted factors to mark patients that are high risk 
4.	Design and develop a secure and intuitive website that will provide a user interface for accessing and displaying the algorithm 
5.	Build a database to house the results of the algorithm 
6.	Deploy the algorithm onto a server and create an API to link the website to the server 
7.	Create an email system to notify users who have been marked as a vaccine priority
8.	Ensure the results from the algorithm are presented understandably on the website using graphs, tables, and charts

## Algorithm Development

### Dataset
For this project, a dataset supplied by the Mexican Government was found that proved to be a perfect fit for the algorithm’s requirements. The dataset was download and accessed from a Kaggle project, seen below, and contained around 500,000 anonymised COVID-19 medical records from Mexico. It had details regarding individual patients medical backgrounds as well as if a patient had developed severe COVID-19 (defined as any patient that died or was placed into ICU).

Dataset Link - https://www.kaggle.com/tanmoyx/covid19-patient-precondition-dataset 

### Prediction Model
To assign the correct point values to each of the obtained risk factors (patient pre-conditions), analysis had to be carried out on the dataset to see which factors were significant in predicting if a patient developed severe COVID-19. This analysis was performed using the statistics based language R.

The dataset was cleaned and a prediction model was created using LASSO regression. The accuracy of the model was calculated at ~87%, more than adequate for a project of this scope. 

The 'glmnet' library was used to create the LASSO model and from this the coefficient values of each factor were extracted. The odds ratio (OR) was calculated by getting the exponent of these values. The formula below placed the odds ratios into a percentage which made them easier to interrupt:
    
`Percent Change in the Odds = (Odds Ratio-1)×100
`    

For example, the odds of having severe COVID with pneumonia (1) over the odds of getting severe COVID without pneumonia (0) is exp(2.37756627) = 10.77864. The percentage change in the odds is (10.77864 – 1) x 100 = 977.863867. From this, we can say that the odds for pneumonia patients getting severe COVID are ~978% higher than the odds for non-pneumonia patients. 

### Points System
The final stage of the algorithm development was converting the OR into a simplistic points system. The points system and the reasoning behind each factor’s value can be seen below. Any factor not in the table had a coefficient (and therefore OR) value of 0, meaning it was not a significant factor in predicting severe COVID-19.
The threshold value for this algorithm is 50, if a patient scores over this number they are classed as high-risk. This value was selected to ensure that the most serious conditions will automatically get flagged. Inversley, it makes sure that less serious conditions do not get flagged as high-risk on their own and have to be combined with other conditions to push them over the threshold.



| Feature          | Odds Ratio to 1 d.p  | Point Value  | Reasoning  |
| ---------------- | -------------------- | ------------ | -----------|
| Pneumonia        | 977.9                | 100          | Having this condition means you are 977% more likely to get severe-COVID-19. Therefore, it deserves the top marks      |
| Renal_chronic    | 97                   | 75           | This condition is second in the severity ranking and needs to be treated as such with a high score      |
| Diabetes         | 33.9                 | 50           | The last of the big three with it having a 33% odds ratio. Having this condition just about means you are at high risk from severe covid       |
| Male             | 27.9                 | 40           | Just under the high-risk threshold being a male makes you 27% more likely to get severe_covid but is not enough to get a vaccination outright       |
| Age >= 50        | 27.1                 | 40           | As above, being over 50 makes you 27% more likely to get severe covid       |
| Hypertension     | 16.0                 | 30           | Having hypertension puts you at 16% more likely to get severe covid      |
| Obesity          | 15.5                 | 30           | Much like hypertension, obesity puts you at ~16% more likely to get severe COVID       |
| Immunosuppressed | 12.4                 | 25           | Slightly less than obesity as this only puts you at 12% more likely to get severe COVID      |
| COPD             | 4.5                  | 25           | The least severe condition of all those analysed having COPD only puts you at a 4.5% greater chance of getting severe covid       |


## Application Development

The application itself was built as an ASP.NET Core project which utilised Angular for the front-end. The calculated point values were written up into a simple algorithm that the application accessed through an API. When a file was uploaded to the application it was sent to the API where the patient data was then extracted from it. Each of the patients pre-conditions was then compared to their corresponding point values to give the user a cumulative risk score. For example, if one of the uploaded patients was a male and over 50 they would be given a score of 80. The calculated scores for each patient were then uploaded to a SQL database before being passed back to the user for them to view. The results were displayed on the site in both a tabular and graphical manner.

![Results](https://user-images.githubusercontent.com/32711675/128013730-4299447c-347d-45da-a84e-69a74819e8d6.PNG)

The application also allows patient data to be manipulated with both edit and delete functionality. As well as this, there are many additional quality of life features that help to provide a good user experience on the site; Loading spinners are presented when API requests are sent, toaster notifications display the outcome of requests and there are several show/hide toggles that permit the user to chose how much information they view at a time.

The final website was secured with Angular authentication guard's and API requests were restricted through the use of Jason Web Tokens. Combined this means only registered users can view patient data and all requests to the API must come from authenticated users. The site was also fully responsive, working on a wide range of device sizes.

Hosting the application was handled through Azure App Service which provided quick and simple deployment.

For screenshots of the completed application navigate to the 'Application Screenshots' folder.
