# Install

```
pip install -e git+ssh://git@github.com/renatormc/report_writer.git@v0.1.16#egg=report_writer
```
ou

```
pip install -e git+https://git@github.com/renatormc/report_writer.git@v0.1.16#egg=report_writer
```

# Update
```
python -m report_writer update master
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
Como os arquivos js e css mudam o nome a cada nova compilação foi disponibilizado a função get_file_names que deve ser utilizada para pegar o nome dos arquivos 
os quais deverão ser passado para o template.

```python
from report_writer import get_file_names

filenames = get_file_names()
```

Importe os arquivos js e css e deixe um div de id "root" passando o nome do modelo no atributo "model_name" e o prefixo da url da api no parâmetro "api_prefix".

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    ...
    <script defer="defer" src="{% static 'report_writer_form/js/' %}{{ filenames.js_filename }}"></script>
    <link href="{% static 'report_writer_form/css/' %}{{ filenames.css_filename }}" rel="stylesheet" />
    ...
  </head>
  <body>
    <div id="root" model_name="{{ model_name }}" url_prefix="api"></div>
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

## Validar dados e renderizar docx
```python
rw = ReportWriter("/caminho/pasta/models")
rw.set_model("docmodel_name")
errors = rw.validate(json_data)
if not errors:
  rw.render_doc("/caminho/do/arquivo.docx")
```

## Pegar listas declaradas no docmodel
As listas de  autocomplete deverão ser salvas em banco para futura filtragem. Para pegar quais listas existem em cada docmodel pode-se utilizar o código a seguir.

```python
rw = ReportWriter("/caminho/pasta/models")
rw.set_model("docmodel_name")
lists = rw.get_lists()
```

## Pegar lista de todos os models existentes

```python
rw = ReportWriter("/caminho/pasta/models")
models = rw.list_models()
```

## Exportar docmodel

```python
rw = ReportWriter("/caminho/pasta/models")
rw.set_model("docmodel_name")
models = rw.export_model("docmodel_name.zip")
```

## Importar docmodel

```python
rw = ReportWriter("/caminho/pasta/models")
models = rw.import_model("docmodel_name.zip")
```

## Deletar docmodel

```python
rw = ReportWriter("/caminho/pasta/models")
rw.delete_model("docmodel_name")
```

## Verificar existência de um docmodel

```python
rw = ReportWriter("/caminho/pasta/models")
if rw.model_exists("docmodel_name"):
  print("Existe")
```

