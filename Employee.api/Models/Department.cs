using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Employee.api.Models
{
    [Table("Departments")]
    public class Department
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DepartmentId { get; set; }
        [Required, MaxLength(100)]
        public string DepartmentName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }
}
