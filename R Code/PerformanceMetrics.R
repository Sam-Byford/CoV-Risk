library(magrittr)
library(dplyr)

x_test <- model.matrix(severe_covid~pneumonia + sex + age + age_high + pregnancy + diabetes + copd + asthma + inmsupr
                       + hypertension + cardiovascular + obesity + renal_chronic + tobacco, test)

lasso_prob <- LassoModel %>% predict(newx = x_test)
predicted.classes <- ifelse(lasso_prob > 0.5, 1, 0)
observed.classes <- test$severe_covid
accuracyOfLasso <- mean(predicted.classes==observed.classes)

