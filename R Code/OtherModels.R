# Gradeint Boosting
require(gbm)
CovidBoost <- gbm(severe_covid~pneumonia + sex + age + age_high + pregnancy
                    + diabetes + copd + asthma + inmsupr + hypertension + cardiovascular
                    + obesity + renal_chronic + tobacco, data = train, distribution = "gaussian",
                  n.trees = 10000, shrinkage = 0.01, interaction.depth = 4
                    )
# Performance of gradient boost
boost_predict = predict(CovidBoost, newdata = x_test, n.trees = n.trees)
predicted.classes <- ifelse(boost_predict > 0.5, 1, 0)
accuracyOfBoost <- mean(predicted.classes==test$severe_covid)