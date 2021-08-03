library(glmnet)

#set seed to ensure reproducible results
set.seed(47)

index = sample.int(n=nrow(CleanedMexData), size= floor(.7*nrow(CleanedMexData)), replace = F)

train = CleanedMexData[index,] # Create the training data 
test = CleanedMexData[-index,] # Create the test data

x <- model.matrix(severe_covid~pneumonia + sex + age + age_high + pregnancy
                  + diabetes + copd + asthma + inmsupr + hypertension + cardiovascular 
                  + obesity + renal_chronic + tobacco, train)
y <- train$severe_covid

#Logistic Regression
LogRegressionModel <- glm(severe_covid~pneumonia + sex + age + age_high + pregnancy
                          + diabetes + copd + asthma + inmsupr + hypertension + cardiovascular
                          + obesity + renal_chronic + tobacco, data = train, family=binomial)

#LASSO regression
LassoReg <- cv.glmnet(x,y,alpha=1,family="binomial",type.measure = "mse" )
Lambda_min <- LassoReg$lambda.min
LassoModel <- glmnet(x, y, alpha = 1, family = "binomial",
                     lambda = Lambda_min)
LassoCoeff <- coef(LassoModel)

OddsRatio <- (exp(LassoCoeff) - 1) * 100


