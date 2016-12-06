import pandas
import seaborn as sns
import matplotlib.pyplot as plt

nba = pandas.read_csv("nba_2013.csv")

sns.pairplot(nba[["ast", "fg", "trb"]])
plt.show()

print nba.mean()
