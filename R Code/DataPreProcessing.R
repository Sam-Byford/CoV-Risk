library(readxl)
library(anchors)
MexData <- read_excel("<File path of Mexican Dataset>")
MexData <- MexData[(MexData$covid_res == 1),]
MexData <- MexData[(!duplicated(MexData$id)),]
MexData$died <- c(0)
MexData[(MexData$date_died!="9999-99-99"), "died"] <- 1
MexData$severe_covid <- c(0)
MexData[(MexData$died==1 | MexData$intubed==1 | MexData$icu==1), "severe_covid"] <- 1
MexData$"age_high" <- c(0)
MexData[(MexData$age>=50), "age_high"] <- 1
CleanedMexData = subset(MexData, select = -c(patient_type,entry_date,
                                             date_symptoms, contact_other_covid,
                                             covid_res, date_died, other_disease))
CleanedMexData <- replace.value(CleanedMexData, c("pneumonia", "sex", "pregnancy", "diabetes", "copd", "asthma", "inmsupr",
                                    "hypertension", "cardiovascular", "obesity", "renal_chronic", "tobacco",
                                    "intubed", "icu"),97,0)

CleanedMexData <- CleanedMexData[!(CleanedMexData$pregnancy == 1 && CleanedMexData$age < 11),] # Removing people too young to be pregnant
CleanedMexData <- CleanedMexData[!(CleanedMexData$age > 100),] # Removing people too old
CleanedMexData <- CleanedMexData[(CleanedMexData$pneumonia != 99 & CleanedMexData$pneumonia != 98) &
                                    (CleanedMexData$pregnancy != 99 & CleanedMexData$pregnancy != 98) &
                                    (CleanedMexData$diabetes != 99 & CleanedMexData$diabetes != 98) &
                                    (CleanedMexData$copd != 99 & CleanedMexData$copd != 98) &
                                    (CleanedMexData$asthma != 99 & CleanedMexData$asthma != 98) &
                                    (CleanedMexData$inmsupr != 99 & CleanedMexData$inmsupr != 98) &
                                    (CleanedMexData$hypertension != 99 & CleanedMexData$hypertension != 98) &
                                    (CleanedMexData$cardiovascular != 99 & CleanedMexData$cardiovascular != 98) &
                                    (CleanedMexData$obesity != 99 & CleanedMexData$obesity != 98) &
                                    (CleanedMexData$renal_chronic != 99 & CleanedMexData$renal_chronic != 98) &
                                    (CleanedMexData$tobacco != 99 & CleanedMexData$tobacco != 98) &
                                    (CleanedMexData$intubed != 99 & CleanedMexData$intubed != 98) &
                                    (CleanedMexData$icu != 99 & CleanedMexData$icu != 98),]

CleanedMexData = subset(CleanedMexData, select = -c(icu, intubed))




