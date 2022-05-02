
class BaseWidget:
    def validate(self):
        for v in self.validators:
            v(self.data)
