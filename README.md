# Install

```
pip install git+ssh://git@github.com/renatormc/report_writer.git@master
```
ou
```
pip install git+https://git@github.com/renatormc/report_writer.git@master
```


# Como desenvolver docmodels
Para desenvolver docmodels o desenvolvedor poderá utilizar apenas a lib report_writer em si. Para isto basta instala no seu python.
Criar uma pasta de trabalho, colocar a pasta de models dentro dela, abrir o terminal na pasta de trabalho e executar o comando a seguir.

```
python -m report_writer dev
```

Acesse no navegador o endereço abaixo substituindo <\model_name>\ pelo nome do docmodel que você irá desenvolver.
```
http://localhost:5000/<model_name>
```

Em seguida vá fazendo as modificações dentro da pasta models.



# Como inserir o frontend no projeto django

## Copiar o bundle

Execute o comando abaixo substituindo <\destination_folder>\ pelo caminho da pasta para a qual você deseja copiar. Escolha uma pasta dentro da sua pasta de arquivos estáticos.

```
python -m report_writer copy-spa <destination_folder>
```

## Importar dentro do template
Importe os arquivos js e css e deixe um div de id "root" passando o nome do modelo no atributo "model_name"

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    ...
    <script defer="defer" src="{% static 'front/js/main.6047306e.js' %}"></script>
    <link href="{% static 'front/css/main.9aa2823c.css' %}" rel="stylesheet" />
    ...
  </head>
  <body>
    <div id="root" model_name="{{ model_name }}"></div>
  </body>
</html>
```

# Como utilizar a lib no backend


## Instanciando o objeto
```python
from report_writer import ReportWriter

rw = ReportWriter("/caminho/pasta/models")
rw.set_model("model_name")
```

## Pegar layout do form
```python
data = rw.get_form_layout()
```

## Pegar dados padrão do form
```python
data = rw.get_default_data()
```

## Validar dados
```python
errors = rw.validate(json_data)
context = rw.
```

## Pegar contexto
O contexto após a validação caso não haja erros se encontrará dentro da propriedade "context"
```python
context = rw.context
```