# CoV-Risk
.NET Core and Angular web application developed for final year dissertation project. Analyses supplied patient data to calculate if the patient is at high-risk for developing a severe form of COVID-19

![User-120221](https://user-images.githubusercontent.com/32711675/127788024-5e7cee4e-5fc9-4243-a0c1-ab06af00d897.PNG)

## Background

First described in 1966 Coronaviruses are single-stranded RNA viruses that infect both humans and animals. Specifically, the coronavirus SARS-COV-2 and the disease it causes, COVID-19, is believed to have originated in animals and then made a successful transition to humans in late 2019. Most cases of COVID-19 are minor with symptoms including fever, cough, and fatigue; however, some people are not so lucky with severe cases leading to multiple organ failure. With a ~4.2% mortality rate (Hu et al., 2020) over 100 million deaths have so far been recorded as a direct result of the disease (World Health Organization, 2020a).

The only realistic path out of the instability the virus has caused is by triggering herd-immunity through vaccination. The first and most promising vaccinations to be introduced globally were the Pfizer-BioNTech and Oxford-AstraZeneca vaccinations. They have great efficacies of 95% (Olliaro, 2021) and 63.09% (World Health Organization, 2021) respectively. However, with these vaccines being developed, a major logistical problem now arises. What is the best way to ensure a fair and accurate distribution of doses to the worlds ~ 7 billion population? Due to risk increasing exponentially as you get older (GOV.UK, 2021), many governments, including in the UK, quickly created priority groups based almost entirely on age. This does ensure a quick rollout of the vaccine; however, it is not entirely fair as it does not necessarily guarantee the most high-risk individuals are protected first. Younger patients with pre-existing conditions that are badly affected by COVID-19 are vaccinated after healthier elderly patients. 

This is where ‘CoV-Risk’, the application built for this project, comes into-effect. The aim of CoV-Risk (and the project in general) is to efficiently flag and notify individuals who should be prioritized for a COVID-19 vaccination and present the data in a clear, logical manner. It does this by analysing patients on a more individual basis. Instead of simply stating that patients over 80 get the vaccination first, CoV-Risk utilises a custom points-based algorithm to examine the patients’ pre-existing conditions, sex, and age to give them a risk score. The higher the risk score, the higher the patient’s priority. This custom-built algorithm is accessed by medical professionals using a fully secure, interactive, website application. 

## Objectives

To complete the aim of the project, objectives were created to help guide the development. These objectives lay out clear markers for the projects programming with the development conducted using R, Angular, ASP.NET Core and SQL.

1.	Compile an extensive list of the factors that lead to series illness with COVID-19 
2.	Assign point values (weights) to the factors based on how influential they are to causing a bad case of COVID-19 and calculate a 'high-risk threshold' value 
3.	Develop the points-based algorithm that analyses supplied data and uses the weighted factors to mark patients that are high risk 
4.	Design and develop a secure and intuitive website that will provide a user interface for accessing and displaying the algorithm 
5.	Build a database to house the results of the algorithm 
6.	Deploy the algorithm onto a server and create an API to link the website to the server 
7.	Create an email system to notify users who have been marked as a vaccine priority
8.	Ensure the results from the algorithm are presented understandably on the website using graphs, tables, and charts

## Algorithm Development

## Application Development

## Application Demonstration

60 Second Demonstration Video - https://youtu.be/k8zp8ZnAE38 
