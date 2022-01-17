# speakeasy

Das speakeasy package wird für das TOTP benutzt, wenn ein admin Nutzer einen "hidden" post erstellen will.
Wir benutzen speakeasy um zu erst beim registrieren ein secret für den Nutzer zu erstellen, mit der "speakeasy.generateSecret()" Funktion. Mit dem secret wird dann später über die "speakeasy.otpauthURL()" Funktion eine url erstellt, mit welcher das "qrcode" package auf dem admindashboard einen QR Code erstellen kann, welchen man z.B. mit der Google Authentiactor app scannen kann.

Beim erstellen eines Posts wird dann ein TOTP Code benötigt falls ein admin Nutzer einen versteckten Post erstellen will. Über die "speakeasy.totp.verify()" Funktion wird das gespeicherte secret mit dem eingegebenen code verglichen und verifiziert, dass der code stimmt.

Wir benutzen das speakeasy package, weil Kenny es schon für die Praxisarbeiten genutzt hat. Dort hat es bei ihm ohne Probleme funktioniert. Bei diesem Projekt sind wir jedoch auf ein Problem gestossen mit der "speakeasy.totp.verify()" Funktion die wir nur über diese [Lösung](https://github.com/speakeasyjs/speakeasy/issues/105#issuecomment-595285318) beheben konnten. Da wir nicht mehr genügend Zeit hatten, ein anderes package zu benutzen, haben wir uns für diese eher schlechte Lösung entschieden.

Das Problem wird wahrscheinlich nicht mehr vom ersteller behoben, weil das package seit einigen Jahren nicht mehr geupdated wurde. Das ist schade, weil das package sehr einfach zum nutzen ist und sonst auch gut funktioniert.

# qrcode

Das qrcode Package bentuzen wir um den QR Code darzustellen. Mit der Funktion "QRCode.toDataURL()" können wir mit der url von der "speakeasy.otpauthURL()" Funktion einfach einen QR Code erstellen und diesen auf dem admindashboard anzeigen.

Dieses package haben wir auch benutzt, weil es für Kenny bei der Praxisarbeit genutzt hat und funktioniert hat. Das package funktionierte auch bei diesem Projekt ohne Probleme.

# nuxt-helmet

Leider ist es mit nuxt js eher schwierig Sicherheits Optionen sprich Headers zu setzen und daher verwenden wir nuxt-helmet. Dieses Package übernimmt für uns das Handling von den Sicherheits Headers und gibt und einfach die Möglichkeit diese an Hand von Options zu aktivieren und leicht zu konfigurieren.

# eslint

Wir verwenden auch während dem Projekt eslint um unser Code auf einem gewissen Standart zu halten und es uns auch einfach die Arbeit erleichtert.

# firebase

Das firebase Package wird gebraucht um die Cloud Platform firebase von Google in dem Projekt verweden werden können. In firebase speichern wir all unsere Einträge und das Login Handling wird auch bereits primär von firebase übernommen. Wir entschieden uns firebase zu verwenden, da es leicht zu gebrauchen ist, bereits auch einiges für uns übernimmt und auch sehr leicht zu integrieren mit nuxt js ist. Firebase übernimmt auch bereits einen Grossteil von der Sicherheits Handhabung und kann die Sicherheitskonzepte auch wahrscheinlich besser als wir umsetzen.
