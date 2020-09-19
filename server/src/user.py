class User():

    def __init__(self, name):
        self.name = name
        self.is_flagged = False

    def __str__(self):
        return "name: " + self.name + "\nis_flagged: " + str(self.is_flagged)

    def json_rep(self):
        '''
        returns string representation of json representation of user
        '''

        def json_string(s):
            if type(s) == bool:
                if s:
                    return "true"
                return "false"
            if type(s) == str:
                return "\"" + s + "\""

        return "{ " + json_string("name") + ":" + json_string(self.name) + ", " + json_string("is_flagged") + ":" + json_string(self.is_flagged) + "}"
