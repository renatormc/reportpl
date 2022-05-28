# Como utilizar templates em html

Fazer referência no template docx da seguinte forma

```html
{{ subdoc_html("template.html") }}
```

no caso acima todo o contexto estará disponível em um variável de nome ctx que pode ser utilizada no html da seguinte forma:

```html
{{ ctx.var_name }}
```

Também é possível passar outras variáveis como segundo parâmetro

```html
{{ subdoc_html("template.html", {'nome': 'João Pereira'}) }}
```

No caso acima além da variável ctx terá a variável nome no contexto do html.

# Tags disponíveis

## Títulos

```html
<h1>Título de nível 1</h1>
<h2>Título de nível 2</h2>
<h3>Título de nível 3</h3>
```

## Parágrafos

```html
<p>Teste de parágrafo</p>
```

### Negrito, itálico, sublinhado
```html
<p bold>Texto em negrito</p>
<p italic>Texto em itálico</p>
<p underline>Texto sublinhado</p>
<p bold italic underline>Texto sublinhado, negrito e italico junto</p>
```

### Runs

Caso no meio de um paragrafo queira colocar apenas algumas plavras em negrito, itálico ou sublinhado é preciso quebra o parágrafo internamente em divs
```html

<p><div>Exemplo de como colocar uma palavra em </div><div bold>negrito</div><div> no meio de um parágrafo</div></p>
```

# Estilos

Os paragrafos terão por padrão o estilo "Normal" caso não especificado outro. Para especificar um estilo a ser utilizado em um parágrafo utilize o atributo class.

```html
<p class="Caption">Esta é uma legenda</p>
```