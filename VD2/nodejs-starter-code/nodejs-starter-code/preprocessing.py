import gzip
import csv
import numpy as np
from sklearn.decomposition import PCA
from sklearn.manifold import MDS
from sklearn.manifold import TSNE

np.set_printoptions(suppress=True) #prevent numpy exponential
                                   #notation on print, default False


def writeCSVFromData(twoDArray, columnArray, filename):
    f = open(filename, 'wb')
    writer = csv.writer(f)
    header = ["xvalue","yvalue","label"]
    writer.writerow(header)
    for i in range(len(columnArray)):
        array = []
        array.append(twoDArray[i][0])
        array.append(twoDArray[i][1])
        array.append(int(columnArray[i]))
        writer.writerow(array)

    f.close()

filepath_images = "t10k-images-idx3-ubyte.gz"
filepath_labels = "t10k-labels-idx1-ubyte.gz"
numberOfFeatures = 784

with gzip.open(filepath_labels, 'rb') as labelPath:
    labelSet = np.frombuffer(labelPath.read(),
                             dtype=np.uint8,
                             offset=8)

with gzip.open(filepath_images,'rb') as imagePath:
    imageSet = np.frombuffer(imagePath.read(),
                             dtype=np.uint8,
                             offset=16).reshape(len(labelSet), numberOfFeatures)

pca = PCA(n_components=2)
mds = MDS(n_components=2, max_iter=20)
tsne = TSNE(n_components=2, n_iter=250, random_state=123)
print("Starting PCA Dataset Transform")
pcaTransform = pca.fit_transform(imageSet)
print("Starting MDS Dataset Transform")
mdsTransform = mds.fit_transform(imageSet)
print("Starting TSNE Dataset Transform")
tsneTransform = tsne.fit_transform(imageSet)
print("Writing PCA Dataset")
writeCSVFromData(pcaTransform, labelSet, "staticdata\\pca_dataset.csv")
print("Writing MDS Dataset")
writeCSVFromData(mdsTransform, labelSet, "staticdata\\mds_dataset.csv")
print("Writing tsne Dataset")
writeCSVFromData(tsneTransform, labelSet, "staticdata\\tsne_dataset.csv")
